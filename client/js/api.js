import Rest from 'restler';
import Promise from 'bluebird';
import config from '../config.json';
import Moment from 'moment';
import * as range from 'moment-range';
import _  from 'lodash';

var methodNamesToPromisify = "get post put del head patch json postJson putJson".split(" ");

function EventEmitterPromisifier(originalMethod) {
    // return a function
    return function promisified() {
        var args = [].slice.call(arguments);
        // Needed so that the original method can be called with the correct receiver
        var self = this;
        // which returns a promise
        return new Promise(function(resolve, reject) {
            // We call the originalMethod here because if it throws,
            // it will reject the returned promise with the thrown error
            var emitter = originalMethod.apply(self, args);

            emitter
                .on("success", function(data, response) {
                    resolve([data, response]);
                })
                .on("fail", function(data, response) {
                    // Erroneous response like 400
                    resolve([data, response]);
                })
                .on("error", function(err) {
                    reject(err);
                })
                .on("abort", function() {
                    reject(new Promise.CancellationError());
                })
                .on("timeout", function() {
                    reject(new Promise.TimeoutError());
                });
        });
    };
};

Promise.promisifyAll(Rest, {
    filter: function(name) {
        return methodNamesToPromisify.indexOf(name) > -1;
    },
    promisifier: EventEmitterPromisifier
});

class Client {
  constructor(baseUrl, restClient) {
    this.baseUrl = baseUrl;
    this.Rest = restClient;
  }


  getContributionChart(ids) {
    var promises = []
    var that = this;
    ids.forEach(function(id){
      promises.push(
        that.Rest.getAsync(that.baseUrl + '/candidate/' + id)
        .then(function(results){
          results = results[0];
          let formattedResults = results.contributions.map(function(contribution){
            return {
              amount: contribution.amount,
              date: contribution.date,
              candidate: results.candidate.displayName
            };
          });
          formattedResults = _.sortBy(formattedResults, 'date');
          let minDate = Moment(formattedResults[0].date).date(1);
          let maxDate = Moment(_.last(formattedResults).date).date(1);
          formattedResults =  _.groupBy(formattedResults, function(result){
            let tempMin = minDate;
            let date = Moment(result.date);
            while(tempMin.isBefore(maxDate)){
              let tempMinPlusMonth = Moment(tempMin).add(1, 'months');
              if(date.isBetween(tempMin, tempMinPlusMonth) || date.isSame(tempMin)) {
                return tempMin;
              } else {
                tempMin.add('months', 1)
              }
            }
            return maxDate;
          });
          return _.map(formattedResults, function(contributions, date){
            var entry = {
              date: Moment(date)
            };
            entry[contributions[0].candidate] = _.reduce(_.pluck(contributions, 'amount'), function(result, contribution){
              return result + contribution;
            }, 0)
            return entry;
          });
        })
      );
    });
    return Promise.all(promises)
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

  getCandidates(){
    return this.Rest.getAsync(this.baseUrl + '/candidate');
  }
}

let endPoints = {
  local: 'http://localhost:3000/dc-campaign-finance/api',
  prod: 'https://dc-finance-backend.herokuapp.com/dc-campaign-finance/api'
};

config.env = config.env || 'local';

export default new Client(endPoints[config.env], Rest);
