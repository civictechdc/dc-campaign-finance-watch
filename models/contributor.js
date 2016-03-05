var path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var config = require('../config/environment');

var contributorTypes = ['Individual', 'Other', 'Corporation'];

var contributorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    groupId: {
        type: Number,
        index: true
    },
    employers: [{
        name: String,
        address: String
    }],
    address: {
        type: {
            raw: String,
            zip: {
                type: String,
                index: true
            },
            city: String,
            state: String,
            street: String,
            ward: {
                type: String,
                index: true
            },
            quadrant: String,
            unitNumber: String,
            use: String,
            _id: false
        },
        required: true
    },
    contributorType: String
});

contributorSchema.virtual('resource')
    .get(function () {
        return path.join(config.baseUrl, 'contributor', this._id.toString());
    });

contributorSchema.index({
    '$**': 'text'
});

module.exports = mongoose.model('Contributor', contributorSchema);
