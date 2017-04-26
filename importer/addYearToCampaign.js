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

Candidates.find()
  .then(function(candidates) {
    candidates.forEach(function(candidate) {
      var updatedCampaigns = candidate.campaigns.map(function(campaign) {
        var campaignYear = 2000 + Number(campaign.raceId.substring(0, 2));
        if (_.isNumber(campaignYear)) {
          campaign.year = campaignYear;
          return campaign;
        }
        return campaign;
      });
      //console.log(updatedCampaigns);
      Candidates.findByIdAndUpdate(
        candidate.id,
        {
          $set: {
            campaigns: updatedCampaigns
          }
        },
        function(err, newC) {
          console.trace(err);
          console.log(newC);
        }
      );
    });
  })
  .then(function() {
    console.log('processed all records');
    //mongoose.disconnect();
  });
