//contributions.js
//Contributions API

var db = require('./campaignFinanceDb')();
var q = require('q');
var logger = require('./utils/logger');

module.exports = {
    getTopIndividualDonors: getTopIndividualDonors,
    getTopCorporateDonors: getTopCorporateDonors,
    getDonorsForCandidate: getDonorsForCandidate,
    getAllDonors: getAllDonors
}

function getTopIndividualDonors(year) {
	var deferred = q.defer();

	db
	.contributions
	.aggregate(
		{$match:{type: "Individual"}},
		{$group:{_id: '$contributor', amount: {$sum: '$amount'}}},
		{$sort: {amount: -1}},
		{$limit: 10}
	)
	.then(function(data){
		deferred.resolve(data);
	}, function(err){
		deferred.reject(err);
	});

	return deferred.promise;
}

function getTopCorporateDonors(year){
	var deferred = q.defer();

	db
	.contributions
	.aggregate(
		{$match:{type: {$in: ["Other", "Corporation"]}}},
		{$group:{_id: '$contributor', amount: {$sum: '$amount'}}},
		{$sort: {amount: -1}},
		{$limit: 10}
	)
	.then(function(data){
		deferred.resolve(data);
	}, function(err){
		deferred.reject(err);
	});

	return deferred.promise;
}

function getDonorsForCandidate(candidate, skip) {

}

function getAllDonors(skip) {

}

