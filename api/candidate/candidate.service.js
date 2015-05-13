var ObjectId = require('mongoose').Types.ObjectId;

var Promise = require('bluebird');

var Candidate = require('../../models/candidate');
Promise.promisifyAll(Candidate);

var Contribution = require('../../models/contribution');
Promise.promisifyAll(Contribution);

exports.findCandidate = function(candidateId) {
  var contributionsPromise = Contribution.findAsync({candidate: candidateId});
  var candidatePromise = Candidate.findByIdAsync(candidateId);

  return Promise.join(candidatePromise, contributionsPromise, function(candidate, contributions){
    var candidateResponse = {};
    candidateResponse.candidate = candidate;
    candidateResponse.contributions = contributions;
    return candidateResponse;
  });
}

exports.findElectedCandidates = function(year) {
  return Candidate.findAsync({positions: {$elemMatch: {'period.from': 2014}}});
}

exports.addCandidate = function(candidate) {

}
