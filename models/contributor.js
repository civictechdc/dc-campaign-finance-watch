var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var contributorTypes = ['Individual', 'Other', 'Corporation'];

var contributorSchema = new Schema({
  name: {type: String, required: true},
  address: {
    type: {
      zip: String,
      city: String,
      state: String,
      street: String,
      _id: false
    },
    required: true,
    unique: true
  },
  contributionType:{
    type: String,
    enum: contributorTypes,
    required: true
  },
  alias: [{
      name: Schema.Types.Mixed,
      rule: String
  }]
});

module.exports = mongoose.model('Contributor', contributorSchema);
