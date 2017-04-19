const candidateService = require('../candidate/candidate.service');
const Moment = require('moment');
const redis = require('../redisClient').client;

exports.getCandidateCampaignsByTypeAndDate = function(req, res) {
  let dateFormat = 'MM/DD/YYYY';
  let fromDate = req.query.fromDate !== 'undefined' ? req.query.fromDate :  Moment('01/01/2006', dateFormat);
  let toDate = req.query.toDate !== 'undefined' ? req.query.toDate :  Moment(new Date(), dateFormat);
  let raceType = req.query.raceType;

    redis.getAsync(req.url)
        .then(function(value){
            if(value) {
                return value.candidates;
            }
            return candidateService.findCandidateByRaceAndYear(raceType, fromDate.year(), toDate.year())
                .then(function(candidates){
                    if(candidates) {
                        redis.setAsync(req.url, {candidates: candidates});
                    }
                    return candidates;
                })
                .catch(function(err){
                    console.log(err);
                });
        })
        .then(function(candidates){
            res.send(candidates);
        })
        .catch(function(err){
            console.log(err, req.url);
        });
};

exports.getRaces = function(req, res) {
    res.send([
        'Council',
        'Mayor',
        'Attorney General',
        'School Board',
        'Statehood Delegation',
        'Partisan Positions'
    ]);
};
