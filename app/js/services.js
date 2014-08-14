'use strict';

var myAppServices = angular.module('myApp.services', []);

myAppServices.factory('API', ['$http',
  function($http) {
    return {

      url: '//rawgit.com/codefordc/dc-campaign-finance-data/master/json',

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
        API.get('/years and offices.json').success(_.bind(function(response) {
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


function contributorTypeSums(records) {
  var returnedData = [];


  function sumNum(items) {
    return _.reduce(items, function(memo, num) {
      return accounting.unformat(memo) + num;
    }, 0);
  }

  var all_types = _.chain(records).pluck('Contributor Type').uniq().value();

  var recordsGroupCandidate = _.groupBy(records, 'Candidate Name');
  for (var candidateName in recordsGroupCandidate) {
    var recordsGroupType = _.groupBy(recordsGroupCandidate[candidateName], 'Contributor Type');
    for (var conType in recordsGroupType) {
      var totalCont = sumNum(_.pluck(recordsGroupType[conType], "Amount"));
      returnedData.push({
        candidate: candidateName,
        type: conType,
        amount: totalCont
      });
    }
    // now add an amount of zero for all contribution types that the candidate
    // did not recieve
    var blankTypes = _.difference(all_types, _.keys(recordsGroupType));
    _.map(blankTypes, function(type) {
      returnedData.push({
        candidate: candidateName,
        type: type,
        amount: 0
      });
    });
  }

  return returnedData;
}


function contributionsFromRecords(records) {
  /*
  Changes the data from` can` to be compatable with a bar chart graph.

  The data format needed is found here: http: //cmaurer.github.io/angularjs-nvd3-directives/multi.bar.chart.html
  In our
  case,
  we need to output data that looks like this:

    {
      series: [{
        name: "Individual",
        data: [50]
      }],
      categories: ['Anita Bonds'],
    }

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
  var returnedData = {
    series: [],
    categories: [],
  };
  var computedData = contributorTypeSums(records);

  var all_types = _.chain(computedData).pluck('type').uniq().value();

  _.map(all_types, function(type) {
    returnedData.series.push({
      name: type,
      data: [],
    });
  });

  var dataGroupCandidate = _.groupBy(computedData, 'candidate');
  for (var candidate in dataGroupCandidate) {
    returnedData.categories.push(candidate);

    var dataGroupType = _.indexBy(dataGroupCandidate[candidate], 'type');
    for (var type in dataGroupType) {
      _.findWhere(returnedData.series, {
        name: type
      }).data.push(dataGroupType[type].amount);
    }
  }

  return returnedData;
}

myAppServices.factory('Records', ['API', '$rootScope',
  function(API, $rootScope) {

    return {
      update: function() {
        API.get('/' + $rootScope.selected.year + ' ' + $rootScope.selected.office + '.json').success(_.bind(function(response) {
          var here = this;
          this.records = response;
        }, this));
      },

      updateContributionType: function() {
        if (!this.records) {
          this.contributionType = [];
        } else {
          this.contributionType = contributionsFromRecords(this.records);
        }
      },
    };
  }
]);
