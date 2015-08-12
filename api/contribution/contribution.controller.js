// Contributor Service
var contributionService = require('../contribution/contribution.service');

exports.getTopIndividaulContributors = function(req, res){
  contributionService
    .findTopIndividualContributors()
    .then(function(individuals){
      res.send(individuals);
    });
}
