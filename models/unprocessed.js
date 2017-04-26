var mongoose = require('mongoose'), Schema = mongoose.Schema;

var unprocessedContributionSchema = new Schema({
  data: Schema.Types.Mixed
});

module.exports = mongoose.model(
  'UnprocessedContribution',
  unprocessedContributionSchema
);
