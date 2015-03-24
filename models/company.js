var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

  var companySchema = new Schema({
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
    alias: [{
        name: Schema.Types.Mixed,
        rule: String
    }]
  });

  module.exports = mongoose.model('Company', companySchema);
