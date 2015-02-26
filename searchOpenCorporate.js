var rest = require('restler');
var q = require('q');
var openCorporateEndpoint = 'https://api.opencorporates.com/v0.3/';

var openCorporateApi = {};



openCorporateApi.searchCompany = function(business, state) {
    var searchQuery = openCorporateEndpoint + '/companies/search?q=' + business;
    searchQuery += '&order=score'+
                    '&jurisdiction_code=us_'+state +
                    '&exclude_incactive=true';
    var deferred = q.defer();
    rest.get(searchQuery,{timeout:100000})
            .on('complete', function(result){
                deferred.resolve(result);        
            })
            .on('timeout', function(ms){
                console.log('did not return in ' + ms);
                deferred.reject('did not return');
            });
    return deferred.promise;
    };




module.exports = openCorporateApi;
