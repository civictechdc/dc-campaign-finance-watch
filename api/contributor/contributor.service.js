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


exports.findCompany =  function(companyId) {
  var companyPromise = Contributor.findByIdAsync(companyId);

  var companyObjectId = new ObjectId(companyId);
  var contributionPromise = Contribution.findAsync({ contributorName: companyObjectId });

  return Promise.join(companyPromise, contributionPromise, function(company, contributions){
    console.log(company);
    var companyData = {};
    companyData.company = company;
    companyData.contributions = contributions;
    return companyData;
  });
}

exports.findCompanyDetails = function(companyId) {
  return Contributor.findByIdAsync(companyId);
}

exports.searchForCompany = function(search) {
  return Contributor.findAsync(
      { $text: {$search: search}},
      { score : { $meta: "textScore" } }
    );
}

exports.getOpenCorporateData = function(companyId) {

}

exports.addCompany = function(company) {

}
