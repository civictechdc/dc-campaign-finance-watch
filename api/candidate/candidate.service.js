'use strict';

var Promise = require('bluebird');
var Moment = require('moment');
Promise.promisifyAll(require("mongoose"));
var _ = require('lodash');
var oldestDate = Moment(new Date('01/01/2006', 'MM/DD/YYYY'));

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
    if(!!toDate) {
        toDate = Moment(toDate);
    } else {
        toDate = Moment();
    }

    if(!!fromDate) {
        fromDate = Moment(fromDate);
    } else {
        fromDate = oldestDate;
    }

    var contributionsPromise = Contribution.findAsync({
        candidate: candidateId,
        date: {
            $gte: fromDate.toDate(),
            $lt: toDate.toDate()
        }
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
            var totalAmount = populatedContributions.reduce(function(total, c){
                return total + c.amount;
            }, 0);

            var candidateContributionAmount = populatedContributions.reduce(function(total, c){
                if(c.contributor.contributorType === 'Candidate') {
                    return total + c.amount;
                }
                return total;
            }, 0);

            var dcContributions = populatedContributions.filter(function(c){
                return c.contributor.address.state === 'DC';
            });

            var contributionsLessThan100 = populatedContributions.filter(function(c){
                return c.amount < 100;
            });

            var individualsAtCorporateAddress = populatedContributions.filter(function(c){
                return c.contributor.contributorType === 'Individual' && c.contributor.address.use !== 'RESIDENTIAL';
            });

            candidateResponse.contributions = populatedContributions;
            candidateResponse.totalAmount = totalAmount;
            candidateResponse.individualContributionAtCorporateAddress = individualsAtCorporateAddress.length/ populatedContributions.length;
            candidateResponse.amountContributedByCandidate = candidateContributionAmount/totalAmount;
            candidateResponse.localContributionPercentage = dcContributions.length/populatedContributions.length;
            candidateResponse.smallContributionPercentage = contributionsLessThan100.length/populatedContributions.length;
            candidateResponse.areCorporateContributions = _.some(populatedContributions, function(c){
                return c.contributor.contributorType === 'Corporation' ||
                    c.contributor.contributorType === 'Corporate Sponsored PAC' ||
                    c.contributor.contributorType === 'Limited Liability Company' ||
                    c.contributor.contributorType === 'Sole Proprietorship';
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
