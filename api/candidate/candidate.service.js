'use strict';

var Promise = require('bluebird');
var Moment = require('moment');
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var _ = require('lodash');

// Models
var Candidate = require('../../models/candidate');
var Contribution = require('../../models/contribution');
var oldestDate = Moment(new Date('01/01/2006', 'MM/DD/YYYY'));

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

exports.findCandidate = function (candidateId, campaignIds, toDate, fromDate) {
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

    var candidateResponse = {};

    return Candidate.findById(candidateId)
        .then(function(candidate){
            candidateResponse.candidate = candidate;
            candidateResponse.candidate.campaigns = candidate.campaigns.filter(function(campaign){
                return _.contains(campaignIds, campaign.campaignId) || campaignIds.length === 0;
            });
            var campaignContributionPromises = candidate.campaigns
                .filter(function(campaign){
                    return _.contains(campaignIds, campaign.campaignId) || campaignIds.length === 0;
                })
                .map(function(campaign){
                    return Contribution.find({
                        candidate: candidateId,
                        campaignId: campaign.campaignId
                    })
                    .then(function(contributions){
                        return Contribution.populate(contributions, {
                            path: 'contributor',
                            model: 'Contributor'
                        });
                    })
                    .then(function(contributions){
                        var campaignModel = candidate.campaigns.find(function(camp){
                            return camp.campaignId === contributions[0].campaignId;
                        });

                        var contributionLimit = getContributionLimit(campaignModel.raceTypeDetail);

                        var total = contributions.reduce(function(total, c){
                            return total + c.amount;
                        }, 0);

                        var contributionForMaximum = contributions.filter(function(c){
                            return c.amount === contributionLimit;
                        });

                        var candidateContributionAmount = contributions.reduce(function(total, c){
                            if(c.contributor.contributorType === 'Candidate') {
                                return total + c.amount;
                            }
                            return total;
                        }, 0);

                        var dcContributions = contributions.filter(function(c){
                            return c.contributor.address.state === 'DC';
                        });

                        var contributionsLessThan100 = contributions.filter(function(c){
                            return c.amount < 100;
                        });

                        var individualsAtCorporateAddress = contributions.filter(function(c){
                            return c.contributor.contributorType === 'Individual' && c.contributor.address.use !== 'RESIDENTIAL';
                        });

                        var nonIndividualsAtResidentailAddress = contributions.filter(function(c){
                            return c.contributor.contributorType !== 'Individual' && c.contributor.address.use !== 'NON RESIDENTIAL';
                        });

                        var corporateContributionsExist = _.some(contributions, function(c){
                            return c.contributor.contributorType === 'Corporation' ||
                                c.contributor.contributorType === 'Corporate Sponsored PAC' ||
                                c.contributor.contributorType === 'Limited Liability Company' ||
                                c.contributor.contributorType === 'Sole Proprietorship';
                        });


                        var campaign = {
                            campaignId: contributions[0].campaignId,
                            total: total,
                            campaignContributionLimit: contributionLimit,
                            maximumContributionPercentage: contributionForMaximum.length / contributions.length,
                            averageContribution: total / contributions.length,
                            individualsAtCorporateAddress: individualsAtCorporateAddress.length / contributions.length,
                            nonIndividualsAtResidentialAddress: nonIndividualsAtResidentailAddress.length / contributions.length,
                            amountContributedByCandidate: candidateContributionAmount / total,
                            localContributionPercentage: dcContributions.length / contributions.length,
                            smallContributionPercentage: contributionsLessThan100.length / contributions.length,
                            corporateContributionsExist: corporateContributionsExist,
                            wardConcentrationScore: processWardConcentration(contributions)
                        };
                        if(campaignModel.ward) {
                            //processWardConcentration(campaignModel, contributions);
                            var wardContributions = contributions.reduce(function(total, c){
                                if(c.contributor.address.ward === campaignModel.ward) {
                                    return total + c.amount;
                                }
                                return total;
                            }, 0);
                            campaign.percentFromWard = wardContributions / total;
                        }
                        return campaign;
                    });
            });
            return Promise.all(campaignContributionPromises);
        })
        .then(function(campaignContributions){
            candidateResponse.campaigns = campaignContributions;
            return candidateResponse;
        });
};

exports.searchForCandidate = function (search) {
    var textSearch = Candidate.find({
        $text: {
            $search: search
        }
    }, {
        score: {
            $meta: "textScore"
        }
    });
    var nameRegex = new RegExp('\w*' + search + '\w*');

    var nameSearch = Candidate.find({
        'name.last': {$regex: nameRegex, $options: "si"}
    });
    return Promise.join(textSearch, nameSearch)
        .then(function (textResults, nameResults) {
            return _.flatten(textResults, nameResults);
        });
};

function getContributionLimit(campaignType) {
    switch(campaignType) {
        case 'Mayor':
        case 'Shadow U.S. Representative':
        case 'Shadow U.S. Senator':
            return 2000;
        case 'Attorney General':
        case 'Council - Chair':
        case 'Council - Chair (Special)':
            return 1500;
        case 'Council - At-Large':
        case 'Council - At-Large (Special)':
            return 1000;
        default:
            return 500;
    }
}


function processWardConcentration(contributions) {
    var uniqueDcContributors = _.uniq(contributions.filter(function(contrib){
        return contrib.contributor.address.state === 'DC';
    }));

    var wards = _.uniq(contributions.map(function(contrib){
        return contrib.contributor.address.ward;
    })).filter(function(ward){
        return ward !== 'Outside DC' && ward !== 'PO Box';
    });
    var wardScores = wards.map(function(ward){
        var uniqueWardContributors = _.uniq(contributions.filter(function(contrib){
            return contrib.contributor.address.ward === ward;
        }));

        return Math.pow((uniqueWardContributors.length/uniqueDcContributors.length), 2);
    });

    return wardScores.reduce(function(total, w){
        return total + w;
    }, 0);
}
