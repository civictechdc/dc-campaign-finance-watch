// Contributor Service
var contributionService = require('../contribution/contribution.service');

exports.getTopIndividaulContributors = function(req, res){
  contributionService
    .findTopIndividualContributors()
    .then(function(individuals){
      res.send(individuals);
    });
};

exports.getContributionsForCampaign = function(req, res) {
    var campaign = req.params.campaign;

    contributionService.getContributionsForCampaign(campaign)
        .then(function(contributions){
            return res.send(contributions);
        });
};
