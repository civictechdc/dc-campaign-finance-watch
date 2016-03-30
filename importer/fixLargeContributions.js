var Promise = require('bluebird');
var _ = require('lodash');
var async = require('async');
var Contributions = require('../models/contribution');

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

Contributions.find()
    .then(function(contributions){
        return Promise.map(contributions, function(contribution) {
            var rawContrib = JSON.parse(contribution.rawContribution);
            var correctAmount = rawContrib['Amount'].replace('$', '').replace(',', '');
            return Contributions.findByIdAndUpdate(contribution.id, {
                $set: {
                    amount: parseFloat(correctAmount)
                }
            });
        }, {concurrency: 5});
    })
    .then(function(){
        console.log('done');
        mongoose.disconnect();
        process.exit();
    })
    .catch(function(err){
        console.log(err);
    });
