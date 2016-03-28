var candidateService = require('../candidate/candidate.service');
var Moment = require('moment');
var redis = require('../redisClient').client;

exports.getCandidateCampaignsByTypeAndDate = function(req, res) {
    var fromDate = Moment(req.query.fromDate || '2006-01-01');
    var toDate = Moment(req.query.toDate || new Date());
    var raceType = req.query.raceType;

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
            console.log(err, url);
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
