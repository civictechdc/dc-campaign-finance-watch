var candidateService = require('./candidate.service');
var _ = require('lodash');

exports.getCandidates = function (req, res) {
    candidateService
        .findAllCandidates()
        .then(function (candidates) {
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
    var toDate = req.params.toDate;
    var fromDate = req.params.fromDate;

    candidateService
        .findCandidate(candidateId, toDate, fromDate)
        .then(function (result) {
            result.candidate = result.candidate.toObject({
                virtuals: true
            });
            res.send(result);
        });
};

exports.getElectedOfficials = function (req, res) {
    candidateService
        .findElectedCandidates()
        .then(function (officials) {
            res.send(officials);
        });
};

exports.searchForCandidate = function (req, res) {
    var query = req.query;
    if (query.search) {
        candidateService
            .searchForCandidate(query.search)
            .then(function (results) {
                res.send(_.map(results.slice(0,query.limit || 5), function (result) {
                    return result.toObject({
                        virtuals: true
                    });
                }));
            })
            .catch(function (err) {
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
