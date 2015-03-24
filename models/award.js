var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var awardSchema = new Schema({
  name: {
    type: Schema.ObjectId,
    ref: 'company',
    required: true,
  },
  amount: {type: Number, required: true},
  period: {
    to: Date,
    from: Date,
    _id: false
  },
  agency: {type: Schema.Types.ObjectId, ref: 'agency'},
  contractNumber: {type: String, unique: true},
  caption: String,
  marketType: String
});

module.exports = mongoose.model('Award', awardSchema);
