'use strict';

var Promise = require('bluebird');
var _  = require('lodash');

var Candidate = require('../../models/candidate');
Promise.promisifyAll(Candidate);

var Contribution = require('../../models/contribution');
Promise.promisifyAll(Contribution);

exports.findCandidate = function(candidateId) {
  var contributionsPromise = Contribution.findAsync({candidate: candidateId});
  var candidatePromise = Candidate.findByIdAsync(candidateId);
  var candidateResponse = {};
  return Promise.join(candidatePromise, contributionsPromise, function(candidate, contributions){
    candidateResponse.candidate = candidate;
    candidateResponse.individualContributions = _.filter(contributions, function(contribution){
        return contribution.contributorType === 'Individual';
    });
    var corporateContributions = _.filter(contributions, function(contribution){
      return contribution.contributorType === 'Corporate';
    });

    return Contribution.populate(corporateContributions, {
      path: 'contributorName',
      model: 'Company'
    });

  })
  .then(function(populatedCorporateContributions){
    console.log(populatedCorporateContributions);
    candidateResponse.companyContributions = populatedCorporateContributions;
    return candidateResponse;
  });
}

exports.searchForCandidate = function(search) {
  return Candidate.findAsync(
    {$text: {$search: search}},
    { score : { $meta: "textScore" } }
  );
}

exports.findElectedCandidates = function(year) {
  return Candidate.findAsync({positions: {$elemMatch: {'period.from': 2014}}});
}

exports.addCandidate = function(candidate) {

}
