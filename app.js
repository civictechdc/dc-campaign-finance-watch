'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/environment');

// Restify
var restify = require('restify');
var server = restify.createServer({name: 'dc-campaign-finance'});
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: true }));
server.use(function crossOrigin(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  return next();
});

//Mongoose
var mongoose = require('mongoose');
mongoose.connect(config.mongo.uri);
// mongoose.set('debug', true);

// Candidate
var candidateController = require('./api/candidate/candidate.controller');
server.get('/dc-campaign-finance/api/candidate/:id', candidateController.getCandidateById);
server.get('/dc-campaign-finance/api/candidate', candidateController.searchForCandidate);

// Company
var contributorController = require('./api/contributor/contributor.controller');
server.get('/dc-campaign-finance/api/contributor/:id', contributorController.getCompanyInformation);
server.get('/dc-campaign-finance/api/contributor/contributors/:limit', contributorController.getTopContributingCompanies);
server.get('/dc-campaign-finance/api/contributor', contributorController.searchForCompany);

// Election
var electionController = require('./api/election/election.controller');
server.get('/dc-campaign-finance/api/electionSearch', electionController.getCandidateCampaignsByTypeAndDate);
server.get('/dc-campaign-finance/api/races', electionController.getRaces);

// Contribution
var contributionController = require('./api/contribution/contribution.controller');
server.get('/dc-campaign-finance/api/individual/contributors/:limit', contributionController.getTopIndividaulContributors);
server.get('/dc-campaign-finance/api/contributions/:campaign', contributionController.getContributionsForCampaign);

// Visualization
var visualizationController = require('./api/visualization/visualization.controller');
server.post('/dc-campaign-finance/api/visualization', visualizationController.convertToPng);

server.listen(process.env.PORT || 8001, function(){
    console.log('%s listening at %s', server.name, server.url);
});
