var path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var config = require('./../config/environment');

var candidateSchema = new Schema({
    name: String,
    candidateId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    campaigns: [{
        raceId: String,
        campaignId: String,
        raceType: String,
        raceTypeDetail: String,
        ward: String,
        year: Number
    }]
});

candidateSchema.index({
    "$**": 'text'
});

candidateSchema.virtual('resource')
    .get(function () {
        return path.join(config.baseUrl, 'candidate', this._id.toString());
    });

module.exports = mongoose.model('Candidate', candidateSchema);
