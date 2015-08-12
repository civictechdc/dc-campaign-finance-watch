'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/environment');

// Restify
var restify = require('restify');
var server = restify.createServer({name: 'dc-campaign-finance'});
server.use(restify.queryParser());

//Mongoose
var mongoose = require('mongoose');
mongoose.connect(config.mongo.uri);

// Candidate
var candidateController = require('./api/candidate/candidate.controller');
server.get('/dc-campaign-finance/api/candidate/:id', candidateController.getCandidateById);
server.get('/dc-campaign-finance/api/electedOfficials/:year', candidateController.getElectedOfficials);
server.get('/dc-campaign-finance/api/search/candidate', candidateController.searchForCandidate);

// Company
var contributorController = require('./api/contributor/contributor.controller');
server.get('/dc-campaign-finance/api/company/:id', contributorController.getCompanyInformation);
server.get('/dc-campaign-finance/api/company/contributors/:limit', contributorController.getTopContributingCompanies);
server.get('/dc-campaign-finance/api/search/company', contributorController.searchForCompany);

// Election
var electionController = require('./api/election/election.controller');
server.get('/dc-campaign-finance/api/electionCountdown', electionController.getNextElection);

// Contribution
var contributionController = require('./api/contribution/contribution.controller');
server.get('/dc-campaign-finance/api/individual/contributors/:limit', contributionController.getTopIndividaulContributors);

server.listen(process.env.PORT || 3000, function(){
    console.log('%s listening at %s', server.name, server.url);
});
