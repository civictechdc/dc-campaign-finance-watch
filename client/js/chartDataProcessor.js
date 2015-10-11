import Moment from 'moment';
import _  from 'lodash';
import Promise from 'bluebird';
import Client from './api';

export function ProcessContributorBreakdown(ids, dateRange) {
  var candidatePromises = _.map(ids, function(i){
    return Client
      .getCandidate(i, dateRange)
      .then(function(results){
        var results = results[0];
        let individualCount = _.filter(results.contributions, function(c){ return c.contributor.contributionType === 'Individual'; }).length;
        let corporateCount = _.filter(results.contributions, function(c){ return c.contributor.contributionType === 'Corporation'; }).length;
        let pacCount = _.filter(results.contributions, function(c){ return c.contributor.contributionType === 'Other'; }).length;
        return {
          name: results.candidate.displayName,
          individual: (individualCount/results.contributions.length) * 100,
          corporate: (corporateCount/results.contributions.length) * 100,
          pac: (pacCount/results.contributions.length) * 100
        };
      });
  });
  return Promise.all(candidatePromises);
}

export function ProcessContributionsOverTime(ids, dateRange) {
  var candidatePromises = _.map(ids, function(i){
    return Client
      .getCandidate(i, dateRange)
      .then(function(results){
        return convertToDateContrib(results[0]);
      });
  });
  return Promise.all(candidatePromises)
    .then(function(results){
      let candidates = _.map(results, function(result){
        return _.keys(result[0])[1];
      });
      let dates = _.chain(results)
        .map(function(result){
          return _.pluck(result, 'date');
        })
        .flatten()
        .map(function(date) {
          let cleanedEntry = {
            date: date.format('YYYYMMDD')
          };
          _.forEach(candidates, function(candidate, idx){
            let match = _.find(results[idx], function(entry){
              return entry.date.isSame(date);
            });
            cleanedEntry[candidate] = match ? match[candidate] : 0;
          });
          return cleanedEntry;
        })
        .sortBy('date');
      return dates.value();
    });
}


// private
function convertToDateContrib(results) {
  let formattedResults = results.contributions.map(function(contribution){
    return {
      amount: contribution.amount,
      date: contribution.date,
      candidate: results.candidate.displayName
    };
  });
  formattedResults = _.sortBy(formattedResults, 'date');
  let minDate = Moment(formattedResults[0].date, Moment.UTC).date(1);
  let maxDate = Moment(_.last(formattedResults).date, Moment.UTC).date(1);
  formattedResults =  _.groupBy(formattedResults, function(result){
    let tempMin = minDate;
    let date = Moment(result.date, Moment.UTC);
    while(tempMin.isBefore(maxDate)){
      let tempMinPlusMonth = Moment(tempMin, Moment.UTC).add(1, 'months');
      if(date.isBetween(tempMin, tempMinPlusMonth) || date.isSame(tempMin)) {
        return tempMin;
      } else {
        tempMin.add(1, 'months');
      }
    }
    return maxDate;
  });
  return _.map(formattedResults, function(contributions, date){
    let entry = {
      date: Moment(date, Moment.UTC)
    };
    entry[contributions[0].candidate] = _.reduce(_.pluck(contributions, 'amount'), function(result, contribution){
      return result + contribution;
    }, 0)
    return entry;
  });
}
