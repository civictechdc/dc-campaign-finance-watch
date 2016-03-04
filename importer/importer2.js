var Promise = require('bluebird');
var _ = require('lodash');
var csv = require("fast-csv");
var fs = require('fs');
var async = require('async');

var Candidates = require('../models/candidate');
var Contributions  = require('../models/contribution');
var Contributors = require('../models/contributor');
var UnprocessedContribution = require('../models/unprocessed');
Promise.promisifyAll(Candidates);
Promise.promisifyAll(Contributors);
Promise.promisifyAll(Contributions);


//Mongoose
var mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/campaign-finance', {
    server: {
        poolSize: 50,
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    }
});

var readCount = 0;
var contributionsInserted = 0;
var processRowFunctions = [];
var db = mongoose.connection;

db.on('disconnected', function(){
    process.exit(0);
});

csv.fromPath('results-full.csv', {objectMode: true, headers: true})
    .on("data", function(data){
        readCount++;
        processRowFunctions.push(createInsertFunction(data));
    })
    .on("end", function(){
        console.log(readCount, " records read in");
        console.log(processRowFunctions.length, ' functions to process');
        async.parallelLimit(processRowFunctions, 100, function(err){
            console.log('all rows inserted ', contributionsInserted);
            mongoose.disconnect();
        });
    });


function createInsertFunction(data) {
    return function(callback) {
        var candidateId = data['Candidate ID'];
        var rawId = data['ID'];
        if(candidateId) {
            var candidate = {
                name: data['Candidate Name'],
                campaigns: []
            };
            return Candidates.findOne({candidateId: candidateId})
                .then(function(candidate){
                    // TODO: pull out if its a ward race
                    if(!candidate) {
                        candidate = {
                            name: data['Candidate Name'],
                            candidateId:candidateId,
                            campaigns: [{
                                raceId: data['Race ID'],
                                campaignId: data['Campaign ID'],
                                raceType: data['Race Type'],
                                raceTypeDetail: data['Race Type Detail']
                            }]
                        };
                        return Candidates.findOneAndUpdate({candidateId:candidateId}, candidate, {new: true, upsert: true});
                    }
                    if(!_.some(candidate.campaigns, function(campaign){
                        return campaign.campaignId === data['Campaign ID'];
                    })) {
                        candidate.campaigns.push({
                            raceId: data['Race ID'],
                            campaignId: data['Campaign ID'],
                            raceType: data['Race Type'],
                            raceTypeDetail: data['Race Type Detail']
                        });
                        return Candidates.findOneAndUpdate({candidateId:candidateId}, candidate, {new: true});
                    }
                    return candidate;
                })
                .then(function(candidate){
                    return Contributors.findOne({name: data['Contributor Name']})
                        .then(function(contributor){
                            if(!contributor) {
                                var contributor = {
                                    name: data['Contributor Name'],
                                    groupId: data['Cluster ID'],
                                    address: {
                                        raw: data['Address Raw'],
                                        zip: data['ZIPCODE'] || data['Contributor Zip'],
                                        city: data['Contributor City'],
                                        state: data['Contributor State'],
                                        street: data['FULLADDRESS'] || data['Contributor Address'],
                                        ward: data['WARD'] || 'Outside DC',
                                        quadrant: data['QUADRANT'] || 'Outside DC',
                                        unitNumber: data['UNITNUMBER'] || data['Contributor Address2'],
                                        use: data['RES_TYPE'] || 'Outside DC'
                                    },
                                    contributorType: data['Contributor Type']
                                };
                                if(data['Employer Name'] || data['Employer Address']) {
                                    contributor.employers = [
                                        {
                                            name: data['Employer Name'] || '',
                                            address: data['Employer Address'] || ''
                                        }
                                    ];
                                } else {
                                    contributor.employers = [];
                                }
                                var contribPromise = Contributors.findOneAndUpdateAsync({name: contributor.name}, contributor, {new: true, upsert: true});
                                return Promise.all([candidate, contribPromise]);
                            }
                            if(data['Employer Name'] || data['Employer Address']) {
                                contributor.employers.push(
                                    {
                                        name: data['Employer Name'] || '',
                                        address: data['Employer Address'] || ''
                                    }
                                );
                            }
                            var contribPromise = Contributors.findByIdAndUpdateAsync(contributor.id, contributor, {new: true});
                            return Promise.all([candidate, contribPromise]);
                        });
                })
                .then(function(results){
                    var candidate = results[0];
                    var contributor = results[1];
                    var contribution = {
                        contributor: contributor.id,
                        candidate: candidate.id,
                        campaignId: data['Campaign ID'],
                        date: data['Receipt Date'],
                        amount: parseFloat(data['Amount'].replace('$', '')),
                        contributionType: data['Contribution Type'],
                        campaignContributionType: data['Type'],
                        campaignCommitteeName: data['Committee Name'],
                        rawContribution: JSON.stringify(data),
                        rawId: data['ID']
                    };
                    return Contributions.create(contribution);
                })
                .then(function(){
                    contributionsInserted++;
                    callback(null);
                })
                .catch(function(err){
                    console.trace(err);
                    callback(err);
                });
        } else {
            return UnprocessedContribution.create({data: data})
                .then(function(){
                    callback(null);
                });
        }
    };
}
