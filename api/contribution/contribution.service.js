// Bluebird
var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var _ = require('lodash');

// Contribution Model
var Contribution = require('../../models/contribution');
//Company model
var Contributor = require('../../models/contributor');
// Company service
var contributorService = require('../contributor/contributor.service');

exports.getContributionsForCampaign = function(campaignId) {
    return Contribution.find({
        campaignId: campaignId
    })
    .then(function(contributions){
        return Contribution.populate(contributions, {
            path: 'contributor',
            model: 'Contributor'
        });
    });
};

exports.findTopContributingCompanies = function(limit, year) {
  return Contribution
      .aggregateAsync(
        {$match: {contributorType: "Corporate"}},
        {$group: {_id: '$contributorName', amount: { $sum: '$amount'} }},
        {$sort: {'amount': -1}},
        {$limit: 10})
      .then(function(results){
        var populatedCompanies = _.map(results, function(result){
          return contributorService
            .findCompanyDetails(result._id)
            .then(function(company){
              result.company = company;
              return result;
          });
        });
        return Promise.all(populatedCompanies);
      });
};

exports.findTopIndividualContributors = function(year) {
  return Contribution
    .aggregateAsync(
      {$match: {contributorType: 'Individual'}},
      {$group: {_id: '$contributorName', amount: {$sum: '$amount'}}},
      {$sort: {'amount': -1}},
      {$limit: 10}
    )
    .then(function(results){
      return results;
    });
};

exports.addContribution = function(contribution) {

};

function populateCompanyPromise(id, amount) {
  return contributorService
    .findCompanyDetails(id)
    .then(function(company) {
      var data = {};
      data.company = company;
      data.amount = amount;
      return data;
    });
}
