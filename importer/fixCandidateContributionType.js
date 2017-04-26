var Promise = require('bluebird');
var _ = require('lodash');
var async = require('async');
var Contributions = require('../models/contribution');
var Contributors = require('../models/contributor');
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

var fixed = 0;
Candidates.find()
  .then(function(candidates) {
    return Promise.map(
      candidates,
      function(c) {
        // Check to see if the candidate has all contributed to a campaign
        return Contributors.find({ name: c.name.trim() }).then(function(
          contributors
        ) {
          if (contributors.length === 1) {
            // If the candiate has contributed find all contributions
            // to her/his own campaign and update that contribution
            return Contributions.find({
              contributor: contributors[0].id,
              candidate: c.id
            })
              .then(function(contributions) {
                var updatePromises = contributions.map(function(contrib) {
                  return Contributions.findByIdAndUpdate(contrib.id, {
                    $set: {
                      selfContribution: true
                    }
                  });
                });
                return Promise.all(updatePromises);
              })
              .then(function() {
                // Finally update that contributor record to type individual
                var contributorToFix = contributors[0];
                return Contributors.findByIdAndUpdate(contributorToFix.id, {
                  $set: {
                    contributorType: 'Individual'
                  }
                });
              });
          }
          return [];
        });
      },
      { concurrency: 5 }
    );
  })
  .then(function() {
    console.log('done', fixed);
    mongoose.disconnect();
    process.exit();
  });
