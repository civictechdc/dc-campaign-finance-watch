var candidateService = require('./candidate.service');
var _ = require('lodash');
var redis = require('../redisClient').client;

exports.getCandidates = function (req, res) {
    redis.getAsync(req.url)
        .then(function(value){
            if(value) {
                return value;
            }
            return candidateService
                .findAllCandidates()
                .then(function(candidates){
                    redis.setAsync(req.url, candidates);
                    return candidates;
                });
        })
        .then(function(candidates){
            res.send(candidates.map(function (candidate) {
                return {
                    name: candidate.getName(),
                    id: candidate._id
                };
            }));
        });
};

exports.getCandidateById = function (req, res) {
    var candidateId = req.params.id;
    var campaignIds = req.query.campaigns || [];
    var toDate = req.query.toDate;
    var fromDate = req.query.fromDate;

    redis.getAsync(req.url)
        .then(function(value){
            if(value) {
                return value;
            }
            return candidateService
                .findCandidate(candidateId, campaignIds, toDate, fromDate)
                .then(function (result) {
                    result.candidate = result.candidate.toObject({
                        virtuals: true
                    });
                    return result;
                })
                .then(function(result){
                    redis.setAsync(req.url, result);
                    return result;
                });
        })
        .then(function(results){
            res.send(results);
        })
        .catch(function(err){
            console.log(err);
        });
};

exports.searchForCandidate = function (req, res) {
    var query = req.query;
    if (query.search) {
        redis.getAsync(req.url)
            .then(function(value){
                if(value) {
                    return value.results;
                }
                return candidateService.searchForCandidate(query.search)
                    .then(function(results){
                        results = _.map(results, function (result) {
                            return result.toObject({
                                virtuals: true
                            });
                        });
                        redis.setAsync(req.url, {results: results});
                        return results;
                    });
            })
            .then(function(results){
                res.send(results);
            })
            .catch(function(err){
                console.log(err);
            });
    }
    else {
        candidateService
            .findAllCandidates(query.toDate, query.fromDate)
            .then(function (candidates) {
                res.send(candidates.map(function (candidate) {
                    return {
                        name: candidate.displayName,
                        id: candidate._id
                    };
                }));
            })
            .catch(function (err) {
                console.log(err);
            });
    }
};
