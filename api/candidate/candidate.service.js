'use strict';

var Promise = require('bluebird');
Promise.promisifyAll(require("mongoose"));
var _  = require('lodash');

var Candidate = require('../../models/candidate');
Promise.promisifyAll(Candidate);

var Contribution = require('../../models/contribution');
Promise.promisifyAll(Contribution);

exports.findAllCandidates = function(toDate, fromDate) {
  return Contribution
    .find({
      date:{$gte: new Date(fromDate), $lte: new Date(toDate)}
    })
    .populate('candidate')
    .execAsync()
    .then(function(contributions){
      return _.uniq(_.pluck(contributions, 'candidate'));
    })
    .catch(function(err){
      console.log(err);
    });
}

exports.findCandidate = function(candidateId) {
  var contributionsPromise = Contribution.findAsync({candidate: candidateId});
  var candidatePromise = Candidate.findByIdAsync(candidateId);
  var candidateResponse = {};
  return Promise.join(candidatePromise, contributionsPromise, function(candidate, contributions){
    candidateResponse.candidate = candidate;

    return Contribution.populate(contributions, {
      path: 'contributor',
      model: 'Contributor'
    });

  })
  .then(function(populatedContributions){
    candidateResponse.contributions = populatedContributions;
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
