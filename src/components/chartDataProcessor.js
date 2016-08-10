import Moment from 'moment';
import _ from 'lodash';

const contributorTypes = ['Individual', 'Corporation', 'Other',
'Committee', 'Candidate', 'Sole Proprietorship', 'Democratic', 'Limited Liability Company', 'Corporate Sponsored PAC',
'Labor Sponsored PAC', 'None', 'Partnership', 'Labor', '', 'Organization']

export function ProcessContributionsToTree(data, name) {

    let individual = _.filter(data.contributions, function (c) {
            return c.contributor.contributorType === 'Individual';
        })
        .map(createChildNodes);
    let corporate = _.filter(data.contributions, function (c) {
            return c.contributor.contributorType === 'Corporation';
        })
        .map(createChildNodes);
    let pac = _.filter(data.contributions, function (c) {
            return c.contributor.contributorType === 'Other';
        })
        .map(createChildNodes);

    return {
        "name": name,
        "children": [{
                "name": "Individual Contributions",
                "children": individual
                    },
            {
                "name": "Corporate Contributions",
                "children": corporate
                    },
            {
                "name": "PACs Contributions",
                "children": pac
                    }]
    };
}

export function ProcessContributorBreakdown(contributions, name) {
    let contributionsByType = []

    for (let i=0; i<contributorTypes.length; i++) {
      let count = _.filter(contributions, function (c) {
              return c.contributor.contributorType === contributorTypes[i];
          })
          .length;
      let contributionType = contributorTypes[i]
      let percent = (count/contributions.length)*100
      if (percent != 0) {
        contributionsByType[contributionType] = percent
      }
    }

    return {
        name: name,
        contributions: contributionsByType,
    };
}

export function ProcessContributionsOverTime(results, name) {
    results = [results].map(convertToDateContrib);

    let candidates = _.map(results, function (result) {
        return _.keys(result[0])[1];
    });
    let dates = _.chain(results)
        .map(function (result) {
            return _.map(result, 'date');
        })
        .flatten()
        .map(function (date) {
            let cleanedEntry = {
                date: date.format('YYYYMMDD')
            };
            _.forEach(candidates, function (candidate, idx) {
                let match = _.find(results[idx], function (entry) {
                    return entry.date.isSame(date);
                });
                cleanedEntry[candidate] = match ? match[candidate] : 0;
            });
            return cleanedEntry;
        })
        .sortBy('date');
    return dates.value();

    function convertToDateContrib(contributions) {
        let formattedResults = contributions.map(function (contribution) {
            return {
                amount: contribution.amount,
                date: contribution.date,
                candidate: name
            };
        });
        formattedResults = _.sortBy(formattedResults, 'date');
        let minDate = Moment(formattedResults[0].date, Moment.UTC)
            .date(1);
        let maxDate = Moment(_.last(formattedResults)
                .date, Moment.UTC)
            .date(1);
        formattedResults = _.groupBy(formattedResults, function (result) {
            let tempMin = minDate;
            let date = Moment(result.date, Moment.UTC);
            while (tempMin.isBefore(maxDate)) {
                let tempMinPlusMonth = Moment(tempMin, Moment.UTC)
                    .add(1, 'months');
                if (date.isBetween(tempMin, tempMinPlusMonth) || date.isSame(tempMin)) {
                    return tempMin;
                }
                else {
                    tempMin.add(1, 'months');
                }
            }
            return maxDate;
        });
        return _.map(formattedResults, function (contributions, date) {
            let entry = {
                date: Moment(date, Moment.UTC)
            };
            entry[contributions[0].candidate] = _.reduce(_.map(contributions, 'amount'), function (result, contribution) {
                return result + contribution;
            }, 0);
            return entry;
        });
    }
}

export function ProcessContributionByWard(results) {
    //nest results by campaignId and ward;
    var nested = nest(results, [
    function(c) { return c.contributor.contributorType; },
    function(c) { return c.contributor.address.ward; } ]);

    //Map reduce the nested results to [{campaignId, ward, ammount}].
    let combined = [];
    _.each(nested, function(e, c) {
        let mapped = _.map(e, function(e, ward) {
            return {
            contributorType: c,
            ward: ward,
            amount: _.sumBy(e, function( o ) { return o.amount; })
            };
        }); //map
        //add to result set.
        combined.push(mapped);
    }); //each

    var flat = _.flatten(combined);

    return {
   	    contributorTypes: _.chain(flat).map("contributorType").uniq().value(),
   	    contributions: flat
    };
}

// private
function createChildNodes(contribution) {
    return {
        name: contribution.contributor.name,
        amount: contribution.amount
    };
}

var nest = function (seq, keys) {
    if (!keys.length)
        return seq;
    var first = keys[0];
    var rest = keys.slice(1);
    return _.mapValues(_.groupBy(seq, first), function (value) {
        return nest(value, rest);
    });
};
