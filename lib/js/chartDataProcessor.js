'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ProcessContributionsToTree = ProcessContributionsToTree;
exports.ProcessContributorBreakdown = ProcessContributorBreakdown;
exports.ProcessContributionsOverTime = ProcessContributionsOverTime;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ProcessContributionsToTree(ids, dateRange) {
    var candidatePromises = _lodash2.default.map(ids, function (i) {
        return _api2.default.getCandidate(i, dateRange).then(function (results) {
            var data = results[0];

            var individual = _lodash2.default.filter(data.contributions, function (c) {
                return c.contributor.contributionType === 'Individual';
            }).map(createChildNodes);
            var corporate = _lodash2.default.filter(data.contributions, function (c) {
                return c.contributor.contributionType === 'Corporation';
            }).map(createChildNodes);
            var pac = _lodash2.default.filter(data.contributions, function (c) {
                return c.contributor.contributionType === 'Other';
            }).map(createChildNodes);

            return {
                "name": data.candidate.displayName,
                "children": [{
                    "name": "Individual Contributions",
                    "children": individual
                }, {
                    "name": "Corporate Contributions",
                    "children": corporate
                }, {
                    "name": "PACs Contributions",
                    "children": pac
                }]
            };
        });
    });

    return _bluebird2.default.all(candidatePromises);
}

function ProcessContributorBreakdown(ids, dateRange) {
    var candidatePromises = _lodash2.default.map(ids, function (i) {
        return _api2.default.getCandidate(i, dateRange).then(function (results) {
            var results = results[0];
            var individualCount = _lodash2.default.filter(results.contributions, function (c) {
                return c.contributor.contributionType === 'Individual';
            }).length;
            var corporateCount = _lodash2.default.filter(results.contributions, function (c) {
                return c.contributor.contributionType === 'Corporation';
            }).length;
            var pacCount = _lodash2.default.filter(results.contributions, function (c) {
                return c.contributor.contributionType === 'Other';
            }).length;
            return {
                name: results.candidate.displayName,
                individual: individualCount / results.contributions.length * 100,
                corporate: corporateCount / results.contributions.length * 100,
                pac: pacCount / results.contributions.length * 100
            };
        });
    });
    return _bluebird2.default.all(candidatePromises);
}

function ProcessContributionsOverTime(ids, dateRange) {
    var candidatePromises = _lodash2.default.map(ids, function (i) {
        return _api2.default.getCandidate(i, dateRange).then(function (results) {
            return convertToDateContrib(results[0]);
        });
    });
    return _bluebird2.default.all(candidatePromises).then(function (results) {
        var candidates = _lodash2.default.map(results, function (result) {
            return _lodash2.default.keys(result[0])[1];
        });
        var dates = _lodash2.default.chain(results).map(function (result) {
            return _lodash2.default.pluck(result, 'date');
        }).flatten().map(function (date) {
            var cleanedEntry = {
                date: date.format('YYYYMMDD')
            };
            _lodash2.default.forEach(candidates, function (candidate, idx) {
                var match = _lodash2.default.find(results[idx], function (entry) {
                    return entry.date.isSame(date);
                });
                cleanedEntry[candidate] = match ? match[candidate] : 0;
            });
            return cleanedEntry;
        }).sortBy('date');
        return dates.value();
    });
}

// private
function createChildNodes(contribution) {
    return {
        name: contribution.contributor.name,
        amount: contribution.amount
    };
}

function convertToDateContrib(results) {
    var formattedResults = results.contributions.map(function (contribution) {
        return {
            amount: contribution.amount,
            date: contribution.date,
            candidate: results.candidate.displayName
        };
    });
    formattedResults = _lodash2.default.sortBy(formattedResults, 'date');
    var minDate = (0, _moment2.default)(formattedResults[0].date, _moment2.default.UTC).date(1);
    var maxDate = (0, _moment2.default)(_lodash2.default.last(formattedResults).date, _moment2.default.UTC).date(1);
    formattedResults = _lodash2.default.groupBy(formattedResults, function (result) {
        var tempMin = minDate;
        var date = (0, _moment2.default)(result.date, _moment2.default.UTC);
        while (tempMin.isBefore(maxDate)) {
            var tempMinPlusMonth = (0, _moment2.default)(tempMin, _moment2.default.UTC).add(1, 'months');
            if (date.isBetween(tempMin, tempMinPlusMonth) || date.isSame(tempMin)) {
                return tempMin;
            } else {
                tempMin.add(1, 'months');
            }
        }
        return maxDate;
    });
    return _lodash2.default.map(formattedResults, function (contributions, date) {
        var entry = {
            date: (0, _moment2.default)(date, _moment2.default.UTC)
        };
        entry[contributions[0].candidate] = _lodash2.default.reduce(_lodash2.default.pluck(contributions, 'amount'), function (result, contribution) {
            return result + contribution;
        }, 0);
        return entry;
    });
}