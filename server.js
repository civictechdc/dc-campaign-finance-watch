var restify = require('restify');
var openCorporateApi = require('./searchOpenCorporate');

/** set up bunyan logging */
var logger = require('./utils/logger');

var db = require('./campaignFinanceDb')();

var server = restify.createServer({name: 'dc-campaign-finance'});
server.use(restify.queryParser());

var candidates = require('./candidates');
var contributions = require('./contributions');

function constructResourceUrl(endpoint, id, queryParams) {
    var url = '/dc-campaign-finance/api/' + endpoint + '/' + id + '?';
    for(key in queryParams) {
        url = url + key + '=' + queryParams[key] + '&';
    }

    return url;    
    
}

server.get('/dc-campaign-finance/api', function(req, res, next) {
    logger.debug('getting api meta information');
    res.send(200, {
        name: "DC Campaign Finance API by Code for DC",
        version: 1
    });
});

server.get('/dc-campaign-finance/api/candidate', function(req, res, next) {
    logger.debug('getting all candidates');
    candidates
        .getAllCandidates()
        .then(function(candidates){
            logger.debug(candidates); 
            res.send(200, candidates);
        })
        .catch(function(err){
            logger.error("could not get candidates");
            res.send(500, err);
        });

});

server.get('/dc-campaign-finance/api/candidate/:lastName/:firstName', function(req, res, next){
    
    var id = {};
    id['_id.first_name'] = req.params.firstName;
    id['_id.last_name'] = req.params.lastName;
    
    logger.info(id);
    db
        .candidates
        .findOne(id)
        .then(function(candidate){
            if(!candidate) res.json({'message':'unable to find the candidate'});
            
            var candidateResponse = {};
            candidateResponse.name = candidate._id;
            var corporateDonors = candidate.corporate_donor_count;
            var individualDonors = candidate.individual_donor_count;
            var otherDonors = candidate.other_donor_count;
            var totalDonors = corporateDonors + individualDonors + otherDonors;
            candidateResponse.numberOfDonors = totalDonors;
            candidateResponse.contributorQuality = (candidate.contributor_quality/5) / totalDonors;
            
            
            return candidateResponse;
        })
        .then(function(candidate){
            
            db.contributions
                .find({'candidate':candidate.name})
                .limit(50)
                .toArray()
                .then(function(contributions) {
                    candidate.contributions = contributions;
                    db
                        .contributions
                        .find({'candidate':candidate.name})
                        .count(function(err, count){
                            if(count <= 50) {
                                candidate.moreContributions = false;
                            } else {
                                candidate.moreContributions = true;
                            }
                            res.send(candidate);
                    });
        }, function(err){
            res.send(500, err);
        });
    });    
});

server.get('/dc-campaign-finance/api/position/:position/:year', function(req, res, next){
    logger.info('retrieving information for %s race in %s', req.params.position, req.params.year);
    db.candidates
        .find({campaigns:{position:req.params.position, year:req.params.year}})
        .toArray()
        .then(function(candidates, err){
            if(err) res.json({'message':'unable to find the requested year'});
            res.json({
                position: req.params.position,
                year: req.params.year,
                candidates: candidates
            });      
        });
});     

server.get('/dc-campaign-finance/api/positions/:year', function(req, res, next) {
    logger.info('gathering all races for %s', req.params.year);
    db
        .candidates
        .distinct('campaigns.position', {'campaigns.year':req.params.year})
        .then(function(races, err) {
            if(err) logger.error(err);
            res.send(races);
        });
});

server.get('/dc-campaign-finance/api/candidate/:name/contributions/:page', function(req, res, next){
    var skipAmount = req.params.page * 50;
    logger.debug(skipAmount);
    db.contributions.find({'candidate':req.params.name})
        .skip(skipAmount)
        .limit(50).toArray()
        .then(function(contributions){
            response = {};
            response.contributions = contributions;
            db.contributions.find({'candidate':req.params.name})
                .count(function(err, count){
                    if(count <= (skipAmount+50)) {
                        response.moreContributions = false
                    } else {
                        response.moreContributions = true;
                    }
                    res.send(response);
                });
        });
});

server.get('/dc-campaign-finance/api/electedOfficials/:year', function(req, res, next){
    candidates
        .getElectedOfficials(parseInt(req.params.year))
        .then(function(officials){
            res.send(officials);
        }, function(err){
            res.send(500, err);
        });
});

server.get('/dc-campaign-finance/api/electionCountdown', function(req, res, next){
    var nextElection = new Date(2015, 3, 28);

    res.json({nextElection: nextElection});
})

server.get('/dc-campaign-finance/api/contributions/individuals/top', function(req, res, next){
    contributions
        .getTopIndividualDonors()
        .then(function(donors){
            res.send(donors);
        })
        .catch(function(err){
            res.send(500, err);
        });
});

server.get('/dc-campaign-finance/api/contributions/corporate/top', function(req, res, next){
    contributions
        .getTopCorporateDonors()
        .then(function(donors){
            res.send(donors);
        })
        .catch(function(err){
            res.send(500, err);
        });
});

server.get('/dc-campaign-finance/api/corporate/:corporation/:state', function(req, res, next){
    openCorporateApi.
        searchCompany(req.params.corporation, req.params.state)
        .then(function(info){
            res.send(info);
        })
        .catch(function(err){
            res.send(500, err);
        });
});

server.listen(process.env.PORT || 3000, function(){
    console.log('%s listening at %s', server.name, server.url);
});
