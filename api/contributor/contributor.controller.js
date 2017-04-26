var _ = require('lodash');

// Company Service
var companyService = require('./contributor.service');

// Contributor Service
var contributionService = require('../contribution/contribution.service');

exports.getCompanyInformation = function(req, res) {
  companyService.findCompany(req.params.id).then(function(company) {
    res.send(company);
  });
};

exports.getTopContributingCompanies = function(req, res) {
  contributionService
    .findTopContributingCompanies(req.params.limit)
    .then(function(companies) {
      res.send(companies);
    });
};

exports.searchForCompany = function(req, res) {
  var search = req.query.search;
  companyService
    .searchForCompany(search)
    .then(function(contributors) {
      res.send(
        _.map(contributors, function(contributor) {
          return contributor.toObject({ virtuals: true });
        })
      );
    })
    .catch(function(err) {
      console.log(err);
    });
};
