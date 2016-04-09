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

exports.findCandidateByRaceAndYear = function(race, fromYear, toYear) {
    console.log(toYear);
    return Candidate.find({'campaigns.raceType': race, 'campaigns.year': {'$gte': Number(fromYear), '$lte': Number(toYear)}})
        .then(function(candidates) {
            return candidates.map(function(c){
                return {
                    id: c.id,
                    name: c.name,
                    campaigns: c.campaigns.filter(function(ca){
                        return ca.year >= fromYear && ca.year <= toYear  && ca.raceType === race;
                    })
                };
            });
        });
};

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
                return _.includes(campaignIds, campaign.campaignId) || campaignIds.length === 0;
            });
            var campaignContributionPromises = candidate.campaigns
                .filter(function(campaign){
                    return _.includes(campaignIds, campaign.campaignId) || campaignIds.length === 0;
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


                        var newContribs = contributions.filter(function(c) {
                          //REMOVE EXPLORATORY COMMITTEE TRANSFERS
                          return c.contributor.contributorType !== 'Committee';
                        });

                        var total = newContribs.reduce(function(total, c){
                            return total + c.amount;
                        }, 0);

                        var contributionForMaximum = newContribs.filter(function(c){
                          console.log(c.amount);
                            return c.amount == contributionLimit;
                        });

                        console.log(campaignModel.campaignId);
                        console.log(contributionLimit);
                        console.log(contributionForMaximum.length);

                        var candidateContributionAmount = newContribs.reduce(function(total, c){
                            if(c.contributor.contributorType === 'Candidate') {
                                return total + c.amount;
                            }
                            return total;
                        }, 0);

                        var dcContributions = newContribs.reduce(function(total, c){
                            if(c.contributor.address.state === 'DC') {
                              return total + c.amount;
                            }
                            return total;
                        }, 0);

                        var contributionsLessThan100 = newContribs.filter(function(c){
                            return c.amount < 100;
                        });

                        var individualsAtCorporateAddress = newContribs.filter(function(c){
                            return c.contributor.contributorType === 'Individual' && c.contributor.address.use !== 'RESIDENTIAL';
                        });

                        var nonIndividualsOrCorporateAddress = newContribs.filter(function(c){
                            return (c.contributor.contributorType !== 'Individual' && c.contributor.contributorType !== 'Candidate') || c.contributor.address.use === 'NON RESIDENTIAL';
                        });

                        var corporateContributionsExist = _.some(newContribs, function(c){
                            return c.contributor.contributorType === 'Corporation' ||
                                c.contributor.contributorType === 'Corporate Sponsored PAC' ||
                                c.contributor.contributorType === 'Limited Liability Company' ||
                                c.contributor.contributorType === 'Partnership' ||
                                c.contributor.contributorType === 'Sole Proprietorship';
                        });

                        var pacContribsExist = _.some(newContribs, function(c){
                            return c.contributor.contributorType === 'Corporate Sponsored PAC' ||
                                c.contributor.contributorType === 'Democratic' ||
                                c.contributor.contributorType === 'Labor' ||
                                c.contributor.contributorType === 'Labor Sponsored PAC' ||
                                c.contributor.contributorType === 'Organization' ||
                                c.contributor.contributorType === 'Other PAC or Committee' ||
                                c.contributor.contributorType === 'PAC' ||
                                c.contributor.contributorType === 'Organization' ||
                                c.contributor.contributorType === 'Other';
                        });


                        var wardContributions = newContribs.reduce(function(total, c){
                            // console.log(c.contributor.address.ward);
                            // console.log(campaignModel.ward);
                            if(c.contributor.address.ward === campaignModel.ward) {
                                return total + c.amount;
                            }
                          return total;
                        }, 0);


                        var campaign = {
                            campaignId: contributions[0].campaignId,
                            year: campaignModel.year,
                            raceType: campaignModel.raceTypeDetail,
                            total: total,
                            campaignContributionLimit: contributionLimit,
                            maximumContributionPercentage: contributionForMaximum.length / newContribs.length,
                            averageContribution: total / newContribs.length,
                            individualsAtCorporateAddress: individualsAtCorporateAddress.length / newContribs.length,
                            nonIndividualsOrCorporateAddress: nonIndividualsOrCorporateAddress.length / newContribs.length,
                            amountContributedByCandidate: candidateContributionAmount / total,
                            localContributionPercentage: dcContributions / total,
                            smallContributionPercentage: contributionsLessThan100.length / newContribs.length,
                            corporateContributionsExist: corporateContributionsExist,
                            pacContribsExist: pacContribsExist,
                            percentFromWard: wardContributions / dcContributions,
                            wardConcentrationScore: processWardConcentration(newContribs)
                        };

                        campaign.scores = getScores(campaign);
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
        'name': {$regex: nameRegex, $options: "si"}
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


function processWardConcentration(newContribs) {
    var uniqueDcContributors = _.uniq(newContribs.filter(function(contrib){
      var ward = contrib.contributor.address.ward;
        return contrib.contributor.address.state === 'DC' && (ward === 'Ward 1' || ward === 'Ward 2' || ward === 'Ward 3' ||
        ward === 'Ward 4' || ward === 'Ward 5' || ward === 'Ward 6' || ward === 'Ward 7' || ward === 'Ward 8');
    }));

    var wards = _.uniq(newContribs.map(function(contrib){
        return contrib.contributor.address.ward;
    })).filter(function(ward){
        return ward === 'Ward 1' || ward === 'Ward 2' || ward === 'Ward 3' ||
        ward === 'Ward 4' || ward === 'Ward 5' || ward === 'Ward 6' || ward === 'Ward 7' || ward === 'Ward 8';
    });
    var wardScores = wards.map(function(ward){
        var uniqueWardContributors = _.uniq(newContribs.filter(function(contrib){
            return contrib.contributor.address.ward === ward;
        }));
        return Math.pow((uniqueWardContributors.length/uniqueDcContributors.length), 2);
    });

    return wardScores.reduce(function(total, w){
        return total + w;
    }, 0);
}

var getScores = function(campaign) {



  var dcContribScore = function() {
    var locOne = campaign.localContributionPercentage;
    if(locOne < 1) {
      if(locOne > .5) {
        return (25 - 50*(1 - locOne));
      } else {
        return 0;
      };
    } else {
      return 25;
    }
  };

  var wardScore = function() {
    //ward candidates
    if(campaign.percentFromWard) {
      var locTwoA = campaign.percentFromWard;
      if(locTwoA <=1) {
        if(locTwoA > .7) {
          return 15 - 10*(1 - locTwoA);
        } else if(locTwoA > .5) {
          return 12 - 30*(.7 - locTwoA);
        } else if(locTwoA > .2) {
          return 6 - 20*(.5 - locTwoA);
        } else {
          return 0;
        }
      } else {
        return 15;
      }
    } else {
      //citywide candidates
      var locTwoB = campaign.wardConcentrationScore;
      if(locTwoB >= .15) {
        if(locTwoB < .2) {
          return 15 - 60*(locTwoB - .15);
        } else if(locTwoB < .25) {
          return 12 - 120*(locTwoB - .2);
        } else if(locTwoB < .3) {
          return 6 - 60*(locTwoB - .25);
        } else if(locTwoB < .4) {
          return 3 - 30*(locTwoB - .3);
        } else {
          return 0;
        }
      } else {
        return 15;
      }
    }
  };

  var avgSizeScore = function() {
    var sizeOne = campaign.averageContribution;
    if(campaign.campaignContributionLimit == 500) {
      if(sizeOne >= 50) {
        if(sizeOne < 100) {
          return 10 - .08*(sizeOne - 50);
        } else if(sizeOne < 250) {
          return 6 - .04*(sizeOne - 100);
        } else {
          return 0;
        }
      } else {
        return 10;
      }
    } else if(campaign.campaignContributionLimit == 1000) {
      if(sizeOne >= 50) {
        if(sizeOne < 100) {
          return 10 - .06*(sizeOne - 50);
        } else if(sizeOne < 300) {
          return 7 - .025*(sizeOne - 100);
        } else if(sizeOne < 400) {
          return 2 - .02*(sizeOne - 300);
        } else {
          return 0
        }
      } else {
        return 10;
      }
    } else if(campaign.campaignContributionLimit == 1500) {
      if(sizeOne >= 50) {
        if(sizeOne < 100) {
          return 10 - .04*(sizeOne - 50);
        } else if(sizeOne < 200) {
          return 8 - .03*(sizeOne - 100);
        } else if(sizeOne < 500) {
          return 5 - .016*(sizeOne - 200);
        } else {
          return 0;
        }
      } else {
        return 10;
      }
    } else if(campaign.campaignContributionLimit == 2000) {
      if(sizeOne >= 50) {
        if(sizeOne < 100) {
          return 10 - .04*(sizeOne - 50);
        } else if(sizeOne < 400) {
          return 8 - .02*(sizeOne - 100);
        } else if(sizeOne < 600) {
          return 2 - .01*(sizeOne - 400);
        } else {
          return 0;
        }
      } else {
        return 10;
      }
    } else {
      return 0;
    };
  };

  var contribsMaxScore = function() {
    var sizeTwo = campaign.maximumContributionPercentage;
    if(sizeTwo >= .05) {
      if(sizeTwo < .15) {
        return 10 - 20*(sizeTwo - .05);
      } else if(sizeTwo < .25) {
        return 8 - 30*(sizeTwo - .15);
      } else if(sizeTwo < .5) {
        return 5 - 20*(sizeTwo - .25);
      } else {
        return 0;
      }
    } else {
      return 10;
    }
  };

  var smallContribScore = function() {
    var sizeThree = campaign.smallContributionPercentage;
    if(sizeThree <= .85) {
      if(sizeThree > .7) {
        return 10 - 20*(.85 - sizeThree);
      } else if(sizeThree > .3) {
        return 7 - 10*(.7 - sizeThree); // also equals 10*sizeThree
      } else if(sizeThree > .15) {
        return 3 - 20*(.3 - sizeThree);
      } else {
        return 0;
      }
    } else {
      return 10;
    }
  };

  var anyCorpScore = function() {
    var typeOne = campaign.corporateContributionsExist;
    if(typeOne == 0) {
      return 3;
    } else {
      return 0;
    }
  };

  var anyPacScore = function() {
    var typeTwo = campaign.pacContribsExist;
    if(typeTwo == 0) {
      return 2;
    } else {
      return 0;
    }
  };

  var selfFundScore = function() {
    var typeThree = campaign.amountContributedByCandidate;
    if(typeThree > 0) {
      if(typeThree < .2) {
        return 3 - 15*(typeThree);
      } else {
        return 0;
      }
    } else {
      return 3;
    }
  };

  var businessAddressScore = function() {
    var typeFour = campaign.individualsAtCorporateAddress;
    if(typeFour > .05) {
      if(typeFour < .25) {
        return 2 - 10*(typeFour - .05);
      } else {
        return 0;
      }
    } else {
      return 2;
    }
  };

  var nonIndividualsCompositeScore = function() {
    var typeFive = campaign.nonIndividualsOrCorporateAddress;
    if(typeFive > 0) {
      if(typeFive < .5) {
        return 20 - 40*(typeFive);
      } else {
        return 0;
      }
    } else {
      return 20;
    }
  };

  campaign.scores = {
    dcContribScore: dcContribScore(campaign),
    wardScore: wardScore(campaign),
    avgSizeScore: avgSizeScore(campaign),
    contribsMaxScore: contribsMaxScore(campaign),
    smallContribScore: smallContribScore(campaign),
    anyCorpScore: anyCorpScore(campaign),
    anyPacScore: anyPacScore(campaign),
    selfFundScore: selfFundScore(campaign),
    businessAddressScore: businessAddressScore(campaign),
    nonIndividualsCompositeScore: nonIndividualsCompositeScore(campaign),
    total: dcContribScore(campaign) + wardScore(campaign) + avgSizeScore(campaign) + contribsMaxScore(campaign) +
            smallContribScore(campaign) + anyCorpScore(campaign) + anyPacScore(campaign) + selfFundScore(campaign) +
            businessAddressScore(campaign) + nonIndividualsCompositeScore(campaign)
  };
  // console.log(campaign.scores);
  return campaign.scores;

}
