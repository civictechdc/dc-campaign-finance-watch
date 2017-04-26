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

Candidates.find()
  .then(function(candidates) {
    candidates.forEach(function(candidate) {
      Candidates.findByIdAndUpdate(
        candidate.id,
        {
          $set: {
            profilePictureUrl: ''
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
    mongoose.disconnect();
    process.exit();
  });
