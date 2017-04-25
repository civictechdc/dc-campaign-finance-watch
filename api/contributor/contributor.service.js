// Bluebird
var Promise = require('bluebird');

// Mongoose
var ObjectId = require('mongoose').Types.ObjectId;

// Company
var Contributor = require('../../models/contributor');
Promise.promisifyAll(Contributor);

// Contribution
var Contribution = require('../../models/contribution');
Promise.promisifyAll(Contribution);

exports.findCompany = function(contributorId) {
  var contributorPromise = Contributor.findByIdAsync(contributorId);

  var contributorObjectId = new ObjectId(contributorId);
  var contributionPromise = Contribution.findAsync({
    contributor: contributorObjectId
  });

  return Promise.join(contributorPromise, contributionPromise, function(
    contributor,
    contributions
  ) {
    var contributorData = {
      company: contributor,
      contributions: contributions
    };
    return contributorData;
  });
};

exports.findCompanyDetails = function(companyId) {
  return Contributor.findByIdAsync(companyId);
};

exports.searchForCompany = function(search) {
  return Contributor.findAsync(
    { $text: { $search: search } },
    { score: { $meta: 'textScore' } }
  );
};

exports.getOpenCorporateData = function(companyId) {};

exports.addCompany = function(company) {};
