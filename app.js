// Restify
var restify = require('restify');
var server = restify.createServer({name: 'dc-campaign-finance'});
server.use(restify.queryParser());

//Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dc-campaign-finance-new');

// Candidate
var candidateController = require('./api/candidate/candidate.controller');
server.get('/dc-campaign-finance/api/candidate/:id', candidateController.getCandidateById);
server.get('/dc-campaign-finance/api/electedOfficials/:year', candidateController.getElectedOfficials);

server.listen(process.env.PORT || 3000, function(){
    console.log('%s listening at %s', server.name, server.url);
});
