var mongoose = require('mongoose')
  , Schema =  mongoose.Schema;

var contributorTypes = ['Individual', 'Other', 'Corporate'];
var contributionTypes = ['campaign', 'position'];

var contributionSchema = new Schema({
  name: {type: Schema.Types.Mixed, required: true},
  employerId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  date: Date,
  amount: Number,
  contributorType: {type: String, enum: contributorTypes},
  contributionType: {
    _id: Schema.Types.ObjectId,
    name: {type: String, enum: contributionTypes}
  }
});

module.exports = mongoose.model('Contribution', contributionSchema);
