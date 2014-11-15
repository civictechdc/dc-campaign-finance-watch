var restify = require('restify');
var pmongo = require('promised-mongo');

var campaign_finance_db = pmongo('mongodb://dc-campaign-finance:codefordc@ds041380.mongolab.com:41380/dc-campaign-finance', ['candidates','contributions'])

var server = restify.createServer({name: 'dc-campaign-finance'});

function calculateCorporateToGrassRootRatio(corporateDonors, individualDonors) {
    var ratio = null;
    if(corporateDonors == 0){
        ratio = 1;
    } else if(individualDonors == 0){
        ratio = 0;
    } else {
        ratio = corporateDonors/individualDonors;
    }

    console.log('ratio is ' + ratio);
    return ratio;
};

function calculateContributorQuality(numberOfDonors, quality){
    console.log('calculating quality');
    return quality/(numberOfDonors*8);
}

server.get('/test', function(req, res, next) {
    res.json({message:'this is a test endpoint'});
});

server.get('/dc-campaign-finance/api/candidate', function(req, res, next) {
    console.log('getting all candidates');
    campaign_finance_db.candidates.find({},{'_id':1}).toArray().then(function(candidate_docs){
        candidates = candidate_docs.map(function(candidate){
            return candidate._id
        });
        res.send(candidates);
    });
});

server.get('/dc-campaign-finance/api/candidate/:name', function(req, res, next){
    console.log('retrieving candidate information for %s', req.params.name);
    campaign_finance_db.candidates.findOne({'_id':req.params.name}).then(function(candidate){
        if(!candidate) res.json({'message':'unable to find the candidate'});
        var candidateResponse = {};
        candidateResponse.name = candidate._id;
        var corporateDonors = candidate.corporate_donor_count;
        var individualDonors = candidate.individual_donor_count;
        var otherDonors = candidate.other_donor_count;
        var totalDonors = corporateDonors + individualDonors + otherDonors;
        candidateResponse.numberOfDonors = totalDonors;
        candidateResponse.corporateToGrassRootRatio = calculateCorporateToGrassRootRatio(corporateDonors, individualDonors);
        candidateResponse.contributorQuality = calculateContributorQuality(totalDonors, candidate.contributor_quality);
        return candidateResponse;
    }).then(function(candidate){
        campaign_finance_db.contributions
            .find({'candidate':candidate.name})
            .limit(50)
            .toArray()
            .then(function(contributions) {
                console.log(candidate.name);
                candidate.contributions = contributions;
                campaign_finance_db.contributions
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
            console.log(err);       
        });
    });    
});

server.get('/dc-campaign-finance/api/position/:position/:year', function(req, res, next){
    console.log('retrieving information for %s race in %s', req.params.position, req.params.year);
    res.json({
        position: 'mayor',
        year: req.params.year,
        candidates: [
            {name: 'Muriel Bowser', amount: '5000'},
            {name: 'David Catania', amount: '10000'}
        ]
        });
});     

server.get('/dc-campaign-finance/api/candidate/:name/contributions/:page', function(req, res, next){
    var skipAmount = req.params.page * 50;
    console.log(skipAmount);
    campaign_finance_db.contributions.find({'candidate':req.params.name})
        .skip(skipAmount)
        .limit(50).toArray()
        .then(function(contributions){
            response = {};
            response.contributions = contributions;
            campaign_finance_db.contributions.find({'candidate':req.params.name})
                .count(function(err, count){
                    console.log(count);
                    if(count <= (skipAmount+50)) {
                        response.moreContributions = false
                    } else {
                        response.moreContributions = true;
                    }
                    res.send(response);
                });
        });
});

server.listen(process.env.PORT || 3000, function(){
    console.log('%s listening at %s', server.name, server.url);
});
