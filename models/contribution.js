var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var contributionSchema = new Schema({
    contributor: {
        type: Schema.Types.ObjectId,
        ref: 'Contributor',
        required: true,
        index: true
    },
    campaignId: String,
    campaignContributionType: String,
    campaignCommitteeName: String,
    candidate: {
        type: Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
        index: true
    },
    date: {
        type: Date,
        index: true
    },
    amount: Number,
    contributionType: String,
    rawContribution: String,
    rawId: String,
    selfContribution: Boolean
});

contributionSchema.index({candidate: 1, date: 1});
contributionSchema.index({campaignId: 1, date: 1});


module.exports = mongoose.model('Contribution', contributionSchema);
