'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = require('./config/environment');

// Restify
const restify = require('restify');
const server = restify.createServer({ name: 'dc-campaign-finance' });
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: true }));
server.use(restify.CORS({ credentials: true }));

//Mongoose
const mongoose = require('mongoose');
mongoose.connect(config.mongo.uri);
mongoose.set('debug', true);

// Candidate
const candidateController = require('./api/candidate/candidate.controller');
server.get(
  '/dc-campaign-finance/api/candidate/:id',
  candidateController.getCandidateById
);
server.get(
  '/dc-campaign-finance/api/candidate',
  candidateController.searchForCandidate
);

// Company
const contributorController = require('./api/contributor/contributor.controller');
server.get(
  '/dc-campaign-finance/api/contributor/:id',
  contributorController.getCompanyInformation
);
server.get(
  '/dc-campaign-finance/api/contributor/contributors/:limit',
  contributorController.getTopContributingCompanies
);
server.get(
  '/dc-campaign-finance/api/contributor',
  contributorController.searchForCompany
);

// Election
const electionController = require('./api/election/election.controller');
server.get(
  '/dc-campaign-finance/api/electionSearch',
  electionController.getCandidateCampaignsByTypeAndDate
);
server.get('/dc-campaign-finance/api/races', electionController.getRaces);

// Contribution
const contributionController = require('./api/contribution/contribution.controller');
server.get(
  '/dc-campaign-finance/api/individual/contributors/:limit',
  contributionController.getTopIndividaulContributors
);
server.get(
  '/dc-campaign-finance/api/contributions/:campaign',
  contributionController.getContributionsForCampaign
);
server.get(
  '/dc-campaign-finance/api/contributions/id/:contributionId',
  contributionController.getContributionById
);

// Visualization
const visualizationController = require('./api/visualization/visualization.controller');
server.post(
  '/dc-campaign-finance/api/visualization',
  visualizationController.convertToPng
);

server.listen(process.env.PORT || 8001, function() {
  console.log('%s listening at %s', server.name, server.url);
});
