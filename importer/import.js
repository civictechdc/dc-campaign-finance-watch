//utils
var _ = require('underscore');
var async = require('async');
var Promise = require('bluebird');

//Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dc-campaign-finance-new');

//TODO: delete this later
//Used only to transition initial values
var pmongo = require('promised-mongo');
var oldDb = pmongo('mongodb://localhost/dc-campaign-finance', [
  'candidates',
  'contributions'
]);

//Models
var Award = require('../models/award');
var Candidate = require('../models/candidate');
Promise.promisifyAll(Candidate);
var Company = require('../models/company');
Promise.promisifyAll(Company);
var Contribution = require('../models/contribution');
Promise.promisifyAll(Contribution);

var db = mongoose.connection;

db.once('open', function() {
  console.log('connection established');
});

var missingCandidate = 0;

db.on('disconnected', function() {
  console.log('mongoose disconnected');
  console.log('missing candidate count', missingCandidate);
  process.exit(0);
});

process.on('unhandledRejection', function(reason, promise) {
  console.log(reason);
});

// oldDb
//   .candidates
//   .find({})
//   .toArray()
//   .then(function(records){
//     var saves = _.map(records, function(record){
//       var saveFunction = function(callback) {
//         processOldCandidateRecord(record, callback);
//       }
//       return saveFunction;
//     });
//
//     async.parallel(saves, function(err){
//       console.log('finished processing');
//       mongoose.disconnect();
//     })
//   });

// oldDb
//   .contributions
//   .find({})
//   .toArray()
//   .then(function(records){
//     var saves = _.map(records, function(record){
//       var saveFunction = function(callback) {
//         processCompany(record, callback);
//       }
//       return saveFunction;
//     });
//
//     async.parallel(saves, function(err){
//       console.log('finish processing');
//       mongoose.disconnect();
//     })
//   });

oldDb.contributions.find({}).toArray().then(function(records) {
  var saves = _.map(records, function(record) {
    var saveFunction = function(callback) {
      processContribution(record, callback);
    };
    return saveFunction;
  });

  async.parallelLimit(saves, 20, function(err) {
    console.log('finish procesing');
    mongoose.disconnect();
  });
});

function processOldCandidateRecord(record, callback) {
  var name = record._id;

  Candidate.findOne({ 'name.first': name.first, 'name.last': name.last })
    .exec()
    .then(
      function(candidate) {
        if (!candidate) {
          var newName = { first: name.first_name, last: name.last_name };
          if (name.middle_name) {
            newName.middle = name.middle_name;
          }
          candidate = new Candidate({ name: newName });
        }

        //Merge in campaigns
        var campaigns = _.map(record.campaigns, function(campaign) {
          campaign.individualDonorCount = record.individual_donor_count;
          campaign.corporateDonorCount =
            record.other_donor_count + record.corporate_donor_count;
          campaign.committee = record.committee_name[0];
          return campaign;
        });

        candidate.campaigns = _.union(candidate.campaigns || [], campaigns);

        //Merge in held office
        var positions = _.map(record.held_office, function(office) {
          var fixedOffice = {};
          if (office.chairman) {
            fixedOffice.position = 'Council Chairman';
          } else {
            fixedOffice.postion = office.position;
          }
          fixedOffice.period = { from: office.elected_year };
          fixedOffice.individualDonorCount = record.individual_donor_count;
          fixedOffice.corporateDonorCount =
            record.other_donor_count + record.corporate_donor_count;
          return fixedOffice;
        });

        candidate.positions = _.union(candidate.positions || [], positions);

        candidate.save(function(err) {
          if (err) {
            console.log(err);
          }
          callback(null);
        });
      },
      function(err) {
        console.log(err);
      }
    );
}

function processCompany(record, callback) {
  if (record.type !== 'Individual') {
    Company.findOne({ name: record.contributor }).exec().then(
      function(company) {
        if (!company) {
          company = new Company({ name: record.contributor });
        }

        company.address = {};
        company.address.street = record.address.line_one;
        company.address.zip = record.address.zip;
        company.address.state = record.address.state;
        company.address.city = record.address.city;

        company.save(function(err) {
          callback(null);
        });
      },
      function(err) {
        console.log(err, ' found a duplicate.');
      }
    );
  } else {
    callback(null);
  }
}

function processContribution(record, callback) {
  var contribution = new Contribution();
  contribution.date = record.date;
  contribution.amount = record.amount;

  var candidatePromise = findCandidatePromise(
    record.candidate,
    record.candidate_committee
  );
  if (record.type === 'Individual') {
    contribution.contributorType = 'Individual';
    var companyPromise = Promise.resolve(record.contributor);
  } else {
    contribution.contributorType = 'Corporate';
    var companyPromise = findCompanyPromise(record.contributor);
  }

  companyPromise
    .then(
      function(company) {
        contribution.contributorName = company._id ? company._id : company;
        return candidatePromise;
      },
      function(err) {
        console.log('Error', err);
        callback(null);
      }
    )
    .then(
      function(candidate) {
        if (candidate) {
          contribution.candidate = candidate._id;
          if (candidate.campaigns && candidate.campaigns[0]) {
            contribution.contributionType = {
              _id: candidate.campaigns[0]._id,
              name: 'campaign'
            };
          }
          if (contribution.candidate) {
            console.log('attempting save');
            contribution.save(function(err) {
              console.log('saved');
              callback(null);
            });
          } else {
            callback(null);
          }
        } else {
          missingCandidate++;
          callback(null);
        }
      },
      function(err) {
        console.log(err);
        callback(null);
      }
    );

  // Promise.join(candidatePromise, companyPromise, function(candidate, company) {
  //   console.log('got here');
  //   contribution.candidate = candidate._id;
  //   contribution.contributorName = company._id ? company._id : company;
  //
  //   contribution.contributionType = { _id: candidate.campaigns[0]._id, name: 'campaign'};
  //
  //   contribution.save(function(err){
  //     callback(null);
  //   });
  // })
  // .catch(function(err){
  //   callback(null);
  // })
  // .finally(function(){
  //   callback(null);
  // });

  // if(record.candidate.first_name) {
  //   findCandidatePromise(record.candidate)
  //     .then(function(candidates){
  //       console.log('got results');
  //       callback(null);
  //     }, function(err){
  //       console.log(err);
  //       callback(null);
  //     });
  // }

  // Candidate
  //   .find({})
  //   .exec()
  //   .then(function(candidate){
  //     console.log('test');
  //     console.log(candidate);
  //   }, function(err){
  //     console.log(err);
  //   });
  // Promise.join(Promise.resolve('one'), candidatePromise, function(candidate){
  //   console.log(candidate);
  // })
  // .then(function(test){
  //   console.log(test);
  // })
  // .finally(function(){
  //   console.log('promises finished');
  // });
}

function findCandidatePromise(oldName, committee) {
  return (
    Candidate.findOne({
      'name.first': oldName.first_name,
      'name.last': oldName.last_name
    })
      //.or({'name.first': oldName.first_name, 'name.last': oldName.last_name}, {'campaigns.committee': committee})
      .exec()
  );
}

function findCompanyPromise(lookup) {
  return Company.findOne({ name: lookup }).exec();
}
