'use strict';

var Promise = require('bluebird');
var Moment = require('moment');
Promise.promisifyAll(require("mongoose"));
var _ = require('lodash');
var oldestDate = Moment('01/01/2006', 'mm/dd/yyyy');

var Candidate = require('../../models/candidate');
Promise.promisifyAll(Candidate);

var Contribution = require('../../models/contribution');
Promise.promisifyAll(Contribution);

exports.findAllCandidates = function (toDate, fromDate) {
    return Contribution
        .find({
            date: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            }
        })
        .populate('candidate')
        .execAsync()
        .then(function (contributions) {
            return _.uniq(_.pluck(contributions, 'candidate'));
        })
        .catch(function (err) {
            console.log(err);
        });
};

exports.findCandidate = function (candidateId, toDate, fromDate) {
    var contributionsPromise = Contribution.findAsync({
        candidate: candidateId
    });
    var candidatePromise = Candidate.findByIdAsync(candidateId);
    var candidateResponse = {};
    return Promise.join(candidatePromise, contributionsPromise, function (candidate, contributions) {
            candidateResponse.candidate = candidate;

            return Contribution.populate(contributions, {
                path: 'contributor',
                model: 'Contributor'
            });

        })
        .then(function (populatedContributions) {
            fromDate = Moment(fromDate) || oldestDate;
            toDate = Moment(toDate) || Moment();
            candidateResponse.contributions = _.filter(populatedContributions, function (c) {
                return Moment(c.date)
                    .isBetween(fromDate, toDate);
            });
            return candidateResponse;
        });
};

exports.searchForCandidate = function (search) {
    var textSearch = Candidate.findAsync({
        $text: {
            $search: search
        }
    }, {
        score: {
            $meta: "textScore"
        }
    });
    var nameRegex = new RegExp('\w*' + search + '\w*');
    
    var nameSearch = Candidate.findAsync({
        'name.last': {$regex: nameRegex, $options: "si"}
    });
    return Promise.join(textSearch, nameSearch)
        .then(function (textResults, nameResults) {
            return _.flatten(textResults, nameResults);
        });
};

exports.findElectedCandidates = function (year) {
    return Candidate.findAsync({
        positions: {
            $elemMatch: {
                'period.from': 2014
            }
        }
    });
};
