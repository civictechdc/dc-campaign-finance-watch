'use strict';

var Promise = require('bluebird');
var Moment = require('moment');
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var _ = require('lodash');

// Models
var Candidate = require('../../models/candidate');
var Contribution = require('../../models/contribution');
const dateFormat = 'MM/DD/YYYY';
var oldestDate = Moment('01/01/2006', dateFormat);

exports.findCandidateByRaceAndYear = function(race, fromYear, toYear) {
  return Candidate.find({
    'campaigns.raceType': race,
    'campaigns.year': { $gte: Number(fromYear), $lte: Number(toYear) }
  }).then(function(candidates) {
    return candidates.map(function(c) {
      return {
        id: c.id,
        name: c.name,
        campaigns: c.campaigns.filter(function(ca) {
          return (
            ca.year >= fromYear && ca.year <= toYear && ca.raceType === race
          );
        }),
        profilePictureUrl: c.profilePictureUrl
      };
    });
  });
};

exports.findAllCandidates = function(toDate, fromDate) {
  return Contribution.find({
    date: {
      $gte: new Date(fromDate),
      $lte: new Date(toDate)
    }
  })
    .populate('candidate')
    .execAsync()
    .then(function(contributions) {
      return _.uniq(_.pluck(contributions, 'candidate'));
    })
    .catch(function(err) {
      console.log(err);
    });
};

exports.findCandidate = function(candidateId, campaignIds, toDate, fromDate) {
  if (!!toDate) {
    toDate = Moment(toDate, dateFormat);
  } else {
    toDate = Moment(new Date().format(dateFormat), dateFormat);
  }

  if (!!fromDate) {
    fromDate = Moment(fromDate, dateFormat);
  } else {
    fromDate = oldestDate;
  }

  var candidateResponse = {};

  return Candidate.findById(candidateId)
    .then(function(candidate) {
      candidateResponse.candidate = candidate;
      candidateResponse.candidate.campaigns = candidate.campaigns.filter(
        function(campaign) {
          return (
            _.includes(campaignIds, campaign.campaignId) ||
            campaignIds.length === 0
          );
        }
      );
      var campaignContributionPromises = candidate.campaigns
        .filter(function(campaign) {
          return (
            _.includes(campaignIds, campaign.campaignId) ||
            campaignIds.length === 0
          );
        })
        .map(function(campaign) {
          return Contribution.find({
            candidate: candidateId,
            campaignId: campaign.campaignId
          })
            .then(function(contributions) {
              return Contribution.populate(contributions, {
                path: 'contributor',
                model: 'Contributor'
              });
            })
            .then(function(contributions) {
              var campaignModel = candidate.campaigns.find(function(camp) {
                return camp.campaignId === contributions[0].campaignId;
              });

              var contributionLimit = getContributionLimit(
                campaignModel.raceTypeDetail
              );

              var newContribs = contributions.filter(function(c) {
                //REMOVE EXPLORATORY COMMITTEE TRANSFERS
                return c.contributor.contributorType !== 'Committee';
              });

              var total = newContribs.reduce(function(total, c) {
                return total + c.amount;
              }, 0);

              var contributionForMaximum = newContribs.filter(function(c) {
                return c.amount === contributionLimit;
              });

              var candidateContributionAmount = newContribs.reduce(function(
                total,
                c
              ) {
                if (c.selfContribution) {
                  return total + c.amount;
                }
                return total;
              }, 0);

              var dcContributions = newContribs.reduce(function(total, c) {
                if (c.contributor.address.state === 'DC') {
                  return total + c.amount;
                }
                return total;
              }, 0);

              var contributionsLessThan100 = newContribs.filter(function(c) {
                return c.amount < 100;
              });

              var individualsAtCorporateAddress = newContribs.filter(function(
                c
              ) {
                return (
                  c.contributor.contributorType === 'Individual' &&
                  c.contributor.address.use !== 'RESIDENTIAL'
                );
              });

              var nonIndividualsOrCorporateAddress = newContribs.filter(
                function(c) {
                  return (
                    (c.contributor.contributorType !== 'Individual' &&
                      c.contributor.contributorType !== 'Candidate') ||
                    c.contributor.address.use === 'NON RESIDENTIAL'
                  );
                }
              );

              var corporateContributionsExist = _.some(newContribs, function(
                c
              ) {
                return (
                  c.contributor.contributorType === 'Corporation' ||
                  c.contributor.contributorType === 'Corporate Sponsored PAC' ||
                  c.contributor.contributorType ===
                    'Limited Liability Company' ||
                  c.contributor.contributorType === 'Partnership' ||
                  c.contributor.contributorType === 'Sole Proprietorship'
                );
              });

              var pacContribsExist = _.some(newContribs, function(c) {
                return (
                  c.contributor.contributorType === 'Corporate Sponsored PAC' ||
                  c.contributor.contributorType === 'Democratic' ||
                  c.contributor.contributorType === 'Labor' ||
                  c.contributor.contributorType === 'Labor Sponsored PAC' ||
                  c.contributor.contributorType === 'Organization' ||
                  c.contributor.contributorType === 'Other PAC or Committee' ||
                  c.contributor.contributorType === 'PAC' ||
                  c.contributor.contributorType === 'Organization' ||
                  c.contributor.contributorType === 'Other'
                );
              });

              var wardContributions = newContribs.reduce(function(total, c) {
                if (c.contributor.address.ward === campaignModel.ward) {
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
                maximumContributionPercentage: contributionForMaximum.length /
                  newContribs.length,
                averageContribution: total / newContribs.length,
                individualsAtCorporateAddress: individualsAtCorporateAddress.length /
                  newContribs.length,
                nonIndividualsOrCorporateAddress: nonIndividualsOrCorporateAddress.length /
                  newContribs.length,
                amountContributedByCandidate: candidateContributionAmount /
                  total,
                localContributionPercentage: dcContributions / total,
                smallContributionPercentage: contributionsLessThan100.length /
                  newContribs.length,
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
    .then(function(campaignContributions) {
      candidateResponse.campaigns = campaignContributions;
      return candidateResponse;
    });
};

exports.searchForCandidate = function(search) {
  var textSearch = Candidate.find(
    {
      $text: {
        $search: search
      }
    },
    {
      score: {
        $meta: 'textScore'
      }
    }
  );
  var nameRegex = new RegExp('\w*' + search + '\w*');

  var nameSearch = Candidate.find({
    name: { $regex: nameRegex, $options: 'si' }
  });
  return Promise.join(textSearch, nameSearch).then(function(
    textResults,
    nameResults
  ) {
    return _.flatten(textResults, nameResults);
  });
};

function getContributionLimit(campaignType) {
  switch (campaignType) {
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
  var uniqueDcContributors = _.uniq(
    newContribs.filter(function(contrib) {
      var ward = contrib.contributor.address.ward;
      return (
        contrib.contributor.address.state === 'DC' &&
        (ward === 'Ward 1' ||
          ward === 'Ward 2' ||
          ward === 'Ward 3' ||
          ward === 'Ward 4' ||
          ward === 'Ward 5' ||
          ward === 'Ward 6' ||
          ward === 'Ward 7' ||
          ward === 'Ward 8')
      );
    })
  );

  var wards = _.uniq(
    newContribs.map(function(contrib) {
      return contrib.contributor.address.ward;
    })
  ).filter(function(ward) {
    return (
      ward === 'Ward 1' ||
      ward === 'Ward 2' ||
      ward === 'Ward 3' ||
      ward === 'Ward 4' ||
      ward === 'Ward 5' ||
      ward === 'Ward 6' ||
      ward === 'Ward 7' ||
      ward === 'Ward 8'
    );
  });
  var wardScores = wards.map(function(ward) {
    var uniqueWardContributors = _.uniq(
      newContribs.filter(function(contrib) {
        return contrib.contributor.address.ward === ward;
      })
    );
    return Math.pow(
      uniqueWardContributors.length / uniqueDcContributors.length,
      2
    );
  });

  return wardScores.reduce(function(total, w) {
    return total + w;
  }, 0);
}

var getScores = function(campaign) {
  var dcContribScore = function() {
    var locOne = campaign.localContributionPercentage;
    if (locOne < 1) {
      if (locOne > 0.5) {
        return 25 - 50 * (1 - locOne);
      } else {
        return 0;
      }
    } else {
      return 25;
    }
  };

  var wardScore = function() {
    //ward candidates
    if (campaign.percentFromWard) {
      var locTwoA = campaign.percentFromWard;
      if (locTwoA <= 1) {
        if (locTwoA > 0.7) {
          return 15 - 10 * (1 - locTwoA);
        } else if (locTwoA > 0.5) {
          return 12 - 30 * (0.7 - locTwoA);
        } else if (locTwoA > 0.2) {
          return 6 - 20 * (0.5 - locTwoA);
        } else {
          return 0;
        }
      } else {
        return 15;
      }
    } else {
      //citywide candidates
      var locTwoB = campaign.wardConcentrationScore;
      if (locTwoB >= 0.15) {
        if (locTwoB < 0.2) {
          return 15 - 60 * (locTwoB - 0.15);
        } else if (locTwoB < 0.25) {
          return 12 - 120 * (locTwoB - 0.2);
        } else if (locTwoB < 0.3) {
          return 6 - 60 * (locTwoB - 0.25);
        } else if (locTwoB < 0.4) {
          return 3 - 30 * (locTwoB - 0.3);
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
    if (campaign.campaignContributionLimit == 500) {
      if (sizeOne >= 50) {
        if (sizeOne < 100) {
          return 10 - 0.08 * (sizeOne - 50);
        } else if (sizeOne < 250) {
          return 6 - 0.04 * (sizeOne - 100);
        } else {
          return 0;
        }
      } else {
        return 10;
      }
    } else if (campaign.campaignContributionLimit == 1000) {
      if (sizeOne >= 50) {
        if (sizeOne < 100) {
          return 10 - 0.06 * (sizeOne - 50);
        } else if (sizeOne < 300) {
          return 7 - 0.025 * (sizeOne - 100);
        } else if (sizeOne < 400) {
          return 2 - 0.02 * (sizeOne - 300);
        } else {
          return 0;
        }
      } else {
        return 10;
      }
    } else if (campaign.campaignContributionLimit == 1500) {
      if (sizeOne >= 50) {
        if (sizeOne < 100) {
          return 10 - 0.04 * (sizeOne - 50);
        } else if (sizeOne < 200) {
          return 8 - 0.03 * (sizeOne - 100);
        } else if (sizeOne < 500) {
          return 5 - 0.016 * (sizeOne - 200);
        } else {
          return 0;
        }
      } else {
        return 10;
      }
    } else if (campaign.campaignContributionLimit == 2000) {
      if (sizeOne >= 50) {
        if (sizeOne < 100) {
          return 10 - 0.04 * (sizeOne - 50);
        } else if (sizeOne < 400) {
          return 8 - 0.02 * (sizeOne - 100);
        } else if (sizeOne < 600) {
          return 2 - 0.01 * (sizeOne - 400);
        } else {
          return 0;
        }
      } else {
        return 10;
      }
    } else {
      return 0;
    }
  };

  var contribsMaxScore = function() {
    var sizeTwo = campaign.maximumContributionPercentage;
    if (sizeTwo >= 0.05) {
      if (sizeTwo < 0.15) {
        return 10 - 20 * (sizeTwo - 0.05);
      } else if (sizeTwo < 0.25) {
        return 8 - 30 * (sizeTwo - 0.15);
      } else if (sizeTwo < 0.5) {
        return 5 - 20 * (sizeTwo - 0.25);
      } else {
        return 0;
      }
    } else {
      return 10;
    }
  };

  var smallContribScore = function() {
    var sizeThree = campaign.smallContributionPercentage;
    if (sizeThree <= 0.85) {
      if (sizeThree > 0.7) {
        return 10 - 20 * (0.85 - sizeThree);
      } else if (sizeThree > 0.3) {
        return 7 - 10 * (0.7 - sizeThree); // also equals 10*sizeThree
      } else if (sizeThree > 0.15) {
        return 3 - 20 * (0.3 - sizeThree);
      } else {
        return 0;
      }
    } else {
      return 10;
    }
  };

  var anyCorpScore = function() {
    var typeOne = campaign.corporateContributionsExist;
    if (typeOne == 0) {
      return 3;
    } else {
      return 0;
    }
  };

  var anyPacScore = function() {
    var typeTwo = campaign.pacContribsExist;
    if (typeTwo == 0) {
      return 2;
    } else {
      return 0;
    }
  };

  var selfFundScore = function() {
    var typeThree = campaign.amountContributedByCandidate;
    if (typeThree > 0) {
      if (typeThree < 0.2) {
        return 3 - 15 * typeThree;
      } else {
        return 0;
      }
    } else {
      return 3;
    }
  };

  var businessAddressScore = function() {
    var typeFour = campaign.individualsAtCorporateAddress;
    if (typeFour > 0.05) {
      if (typeFour < 0.25) {
        return 2 - 10 * (typeFour - 0.05);
      } else {
        return 0;
      }
    } else {
      return 2;
    }
  };

  var nonIndividualsCompositeScore = function() {
    var typeFive = campaign.nonIndividualsOrCorporateAddress;
    if (typeFive > 0) {
      if (typeFive < 0.5) {
        return 20 - 40 * typeFive;
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
    total: dcContribScore(campaign) +
      wardScore(campaign) +
      avgSizeScore(campaign) +
      contribsMaxScore(campaign) +
      smallContribScore(campaign) +
      anyCorpScore(campaign) +
      anyPacScore(campaign) +
      selfFundScore(campaign) +
      businessAddressScore(campaign) +
      nonIndividualsCompositeScore(campaign)
  };
  // console.log(campaign.scores);
  return campaign.scores;
};
