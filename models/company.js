var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

  var companySchema = new Schema({
    name: String,
    address: {
      zip: String,
      city: String,
      state: String,
      street: String,
      _id: false
    },
    alias: [{
        name: Schema.Types.Mixed,
        rule: String
    }]
  });

  module.exports = mongoose.model('Company', companySchema);
