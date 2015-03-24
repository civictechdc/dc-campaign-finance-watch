//Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dc-campaign-finance-new');

//TODO: delete this later
//Used only to transition initial values
var pmongo = require('promised-mongo');
var oldDb = pmongo('mongodb://localhost/dc-campaign-finance', ['candidates']);

//utils
var _ = require('underscore');



//Models
var Award = require('../models/award');
var Candidate = require('../models/candidate');
var Comapny = require('../models/company');
var Contribution = require('../models/contribution');

var db = mongoose.connection;

db.once('open', function(){
  console.log('connection established');
});

oldDb
  .candidates
  .find({})
  .toArray()
  .then(function(records){
    _.each(records, processOldCandidateRecord);
  });

function processOldCandidateRecord(record) {
  var name = record._id;

  Candidate
    .findOne({'name.first': name.first, 'name.last': name.last})
    .exec()
    .then(function(candidate) {
      if(!candidate) {
        candidate = new Candidate({name: name});
      }

      //Merge in campaigns
      var campaigns = _.map(record.campaigns, function(campaign){
        campaign.individualDonorCount = record.individual_donor_count;
        campaign.corporateDonorCount = record.other_donor_count + record.corporate_donor_count;
        campaign.committee = record.committee_name[0];
        return campaign;
      });

      candidate.campaigns = _.union(candidate.campaigns || [], campaigns);

      //Merge in held office
      var positions = _.map(record.held_office, function(office){
        office.period.from = office.elected_year;
        delete office.elected_year;
        office.individualDonorCount = record.individual_donor_count;
        office.corporateDonorCount = record.other_donor_count + record.corporate_donor_count;
        return office;
      }));

      candidate.positions = _.union(candidate.positions || [], positions);

      candidate.save(function(err) {
        if(err) {console.log(err)};
      });
    }, function(err){
      console.log(err);
    });
}
