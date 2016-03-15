var Promise = require('bluebird');
var _ = require('lodash');
var async = require('async');
var Candidates = require('../models/candidate');

//Mongoose
var mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/dc-campaign-finance', {
    server: {
        socketOptions: {
            keepAlive: 5,
            connectTimeoutMS: 30000
        }
    }
});

var wardRegex = /.Ward.[0-9]/;

Candidates.find({
        'campaigns.raceType': 'Council'
    })
    .then(function (candidates) {
        candidates.forEach(function (candidate) {
            var updatedCampaigns = candidate.campaigns.map(function (campaign) {
                if (wardRegex.test(campaign.raceTypeDetail)) {
                    var ward = campaign.raceTypeDetail.match(wardRegex)[0];
                    campaign.ward = ward.trim();
                    return campaign;
                }
                return campaign;
            });
            candidate.campaigns = updatedCampaigns;
            console.log(updatedCampaigns);
            Candidates.findByIdAndUpdate(candidate.id, {
                $set: {
                    campaigns: updatedCampaigns
                }
            }, function (err, newC) {
                console.trace(err);
                console.log(newC);
            });
        });
    })
    .then(function () {
        //mongoose.disconnect();
    });
