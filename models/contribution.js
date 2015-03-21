var mongoose = require('mongoose')
  , Schema =  mongoose.Schema;

var contributorTypes = ['Individual', 'Other', 'Corporate'];
var contributionTypes = ['campaign', 'position'];

var contributionSchema = new Schema({
  name: Schema.Types.Mixed,
  employerId: {type: Schema.Types.ObjectId, ref: 'Company'},
  candidate: {type: Schema.Types.ObjectId, ref: 'Candidate'},
  date: Date,
  amount: Number,
  contributorType: {type: String, enum: contributorTypes},
  contributionType: {
    _id: Schema.Types.ObjectId,
    name: {type: String, enum: contributionTypes}
  }
});

module.exports = mongoose.model('Contribution', contributionSchema);
