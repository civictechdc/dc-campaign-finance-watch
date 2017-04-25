const rest = require('restler');
const q = require('q');
const _ = require('lodash');
const openCorporateEndpoint = 'https://api.opencorporates.com/v0.3/';

let openCorporateApi = {};

openCorporateApi.searchCompany = function(business, state) {
  let searchQuery = openCorporateEndpoint + '/companies/search?q=' + business;
  searchQuery +=
    '&order=score' +
    '&jurisdiction_code=us_' +
    state +
    '&exclude_incactive=true';
  const deferred = q.defer();
  rest
    .get(searchQuery, { timeout: 100000 })
    .on('complete', function(res) {
      let correctCompany = _.find(res.results.companies, function(company) {
        return company.branch_status == null;
      });
      console.log(correctCompany);
      if (correctCompany) {
        deferred.resolve(correctCompany);
      } else {
        deferred.reject('unable to find a company in that state');
      }
    })
    .on('timeout', function(ms) {
      console.log('did not return in ' + ms);
      deferred.reject('did not return');
    });
  return deferred.promise;
};

module.exports = openCorporateApi;
