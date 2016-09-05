// Contributor Service
var contributionService = require('../contribution/contribution.service');
var redis = require('../redisClient').client;

exports.getTopIndividaulContributors = function(req, res){
  contributionService
    .findTopIndividualContributors()
    .then(function(individuals){
      res.send(individuals);
    });
};

exports.getContributionsForCampaign = function(req, res) {
    var campaign = req.params.campaign;
    redis.getAsync(req.url)
        .then(function(value){
            if(value) {
                return value.results;
            }
            return contributionService.getContributionsForCampaign(campaign);
        })
        .then(function(contributions){
            if(contributions.length < 1000) {
                redis.setAsync(req.url, {results: contributions});
            }
            res.send(contributions);
        })
        .catch(function(err){
            console.log(err);
        });
};

exports.getContributionById = function(req, res) {
    var contributionId = req.params.contributionId;
    return contributionService
        .getContributionById(contributionId)
        .then(function(contribution) {
            res.send(contribution);
        });
}
