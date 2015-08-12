var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

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

candidateSchema.index({name: 'text', campaigns: 'text', positions: 'text'});

module.exports = mongoose.model('Candidate', candidateSchema);
