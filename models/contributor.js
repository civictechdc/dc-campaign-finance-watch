var path = require('path'),
  mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var config = require('../config/environment');

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

contributor.virtual('resource').get(function(){
  return path.join(config.baseUrl, 'contributor', this._id.toString()); 
});

contributorSchema.index({'$**': 'text'});

module.exports = mongoose.model('Contributor', contributorSchema);
