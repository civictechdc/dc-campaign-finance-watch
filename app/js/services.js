'use strict';

var myAppServices = angular.module('myApp.services', []);

myAppServices.factory('API', ['$http',
  function($http) {
    return {

      url: '//rawgit.com/codefordc/finance/gh-pages/data/output',

      get: function(path) {
        return $http.get(this.url + path, {
          cache: true
        });
      }

    };
  }
]);





myAppServices.factory('Campaigns', ['API', '$rootScope',
  function(API, $rootScope) {
    return {
      update: function() {
        API.get('/election_years_and_offices.json').success(_.bind(function(response) {
          this.campaigns = response;
        }, this));
      },

      get years() {
        if (!this.campaigns) {
          return [];
        }
        return _.chain(this.campaigns)
          .pluck('Election Year')
          .uniq(true)
          .value()
          .reverse();
      },

      get offices() {
        if (!this.campaigns) {
          return [];
        }
        return _.chain(this.campaigns)
          .where({
            'Election Year': $rootScope.selected.year
          })
          .pluck('Office')
          .value();
      },

      officeContended: function(office) {
        return _.contains(this.offices, office);
      }
    };
  }
]);

function contributionsFromRecords(records) {
  /*
  Changes the data from` can` to be compatable with a bar chart graph.

  The data format needed is found here: http: //cmaurer.github.io/angularjs-nvd3-directives/multi.bar.chart.html
  In our
  case,
  we need to output data that looks like this:

    [{
        "key": "Corporation",
        "values": [
          ["Elissa Silverman", 0],
          ["Some other Guy", 1000], ...
        ]
      }, {
        "key": "Indivual",
        "values": [
          ["Elissa Silverman", 1000],
          ["Some other Guy", 0], ...
        ]
      },
      ...
    ]

    The input pie chart data looks like this:

    [{
        "Contribution Type": "Check",
        "Zip": "20011",
        "Contributor Type": "Individual",
        "Date of Receipt": "2/1/2014",
        "Address": "6101 16th St NW 514",
        "Employer Address": "",
        "Contributor": "Nicholas, Carolyn",
        "Committee Name": "Bonds for Council 2014",
        "Amount": "$50.00",
        "Candidate Name": "Anita Bonds ",
        "city": "Washington",
        "state": "DC",
        "Employer Name": "Long and Foster"
      },
      ...
  */
  var returnedData = [];

  function pushAndReturn(list, item) {
    list.push(item);
    return list.last();
  }

  function findWhereOrPush(list, properties) {
    return _.findWhere(list, properties) || pushAndReturn(list, properties);
  }

  function findOrPush(list, predicate, item) {
    return _.find(list, predicate) || pushAndReturn(list, item);
  }

  function addRecordData(candidate, category, amount) {
    // We are building up the `returnedData` list,

    // First find the object in the list for this type
    // If it doesn't exist, create one
    _(findWhereOrPush(returnedData, {
        "key": category,
      }))
      // Then make sure that object has a values list
      .defaults({
        "values": []
      })
      // get that values list for that contribution type
      .values
      // Then make sure the values list has an item for the candidate
      // if not create one
      .findOrPush(function(i) {
        return i[0] === candidate;
      }, [candidate, 0])
      // get that candidate amount pairing
      [1] += amount;
  }
  records.map(function(record) {
    addRecordData(
      record['Candidate Name'],
      record['Contributor Type'],
      accounting.unformat(record['Amount'])
    );
  });
  return returnedData;
}

myAppServices.factory('Records', ['API', '$rootScope',
  function(API, $rootScope) {

    return {
      update: function() {
        API.get('/' + $rootScope.selected.year + ' ' + $rootScope.selected.office + '.json').success(_.bind(function(response) {
          this.records = response;
        }, this));
      },

      get contributionType() {
        if (!this.records) {
          return [];
        }
        return contributionsFromRecords(this.records);
      }
    };
  }
]);
