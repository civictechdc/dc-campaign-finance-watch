var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var candidateSchema = new Schema({
  name: {
    first: String,
    middle: String,
    last: String,
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

module.exports = mongoose.model('Candidate', candidateSchema);
