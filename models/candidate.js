var path = require('path'),
  mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var config = require('../config/environment');

var candidateSchema = new Schema({
  name: {type:
    {
      first: String,
      middle: String,
      last: String,
    },
    unique: true,
    required: true
  },
  campaigns: [
    {
    position: String,
    committee: String,
    year: Number,
    individualDonorCount: Number,
    corporateDonorCount: Number
    }
  ],
  positions: [
    {
      position: String,
      period: {
        _id: false,
        from: Number,
        to: Number
      },
      individualDonorCount: Number,
      corporateDonorCount: Number
    }
  ]
});

candidateSchema.index({"$**": 'text'});

candidateSchema.virtual('resource').get(function(){
  return path.join(config.baseUrl, 'candidate', this._id.toString());
});

candidateSchema.virtual('displayName').get(function(){
  return this.name.first + ' ' + this.name.last;
});

module.exports = mongoose.model('Candidate', candidateSchema);
