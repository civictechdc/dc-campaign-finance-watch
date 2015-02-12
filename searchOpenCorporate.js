var rest = require('restler')

var openCorporateEndpoint = 'https://api.opencorporates.com/v0.3/'

var openCorporateApi = {}

openCorporateApi.searchCompany = function(business, jurisdiction) {
    var searchQuery = openCorporateEndpoint + '/companies/search?q=' + business;
    if(jurisdiction) {
        searchQuery += ('&jurisdiction_code=' + jurisdiction);
    }
    searchQuery += '&order=score';
    rest.get(searchQuery,{timeout:100000})
            .on('complete', function(result){
                return result;        
            })
            .on('timeout', function(ms){
                console.log('did not return in ' + ms);
            });
    };



module.exports = openCorporateApi;
