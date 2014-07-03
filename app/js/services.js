'use strict';

/* Services */


var myAppServices = angular.module('myApp.services', []);


myAppServices.factory('Data', ['$resource', '$http',
  function ($resource, $http) {
    var data = {
      year: 2014,
      years: [2014, 2013, 2012, 2011, 2010],
      office: "Mayor",
      cityWideOffices: ['Mayor', 'Council Chairman', 'Council At-Large'],
      districtWideOffices: ['Council Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8'],
      api_url: '//rawgit.com/codefordc/finance/pages/data/output'
    };

    // function setProperty(obj, prop, get) {
    //   Object.defineProperty(obj, prop, {
    //     configurable: true, // property descriptor may be changed
    //     enumerable: true, // property shows up during enumeration of the property
    //     get: get,
    //   });
    // }


    data.fetchCampaigns = function () {
      $http.get(this.api_url + '/election_years_and_offices.json', {
        cache: true,
      }).success(function (returned) {
        data.campaigns = returned;
      });
    }

    data.years = function () {
      return Object.keys(this.campaigns).reverse();
    }

    data.offices = function () {
      return this.campaigns[this.year];
    }


    data.fetchPieChart = function () {
      $http.get(data.api_url + '/' + data.year + ' ' + data.office + '.json', {
        cache: true,
      }).success(function (returned) {
        data.pieChart = returned;
      }).error(function () {
        data.pieChart = {};
      })
    }

    data.candidates = function () {
      return Object.keys(this.pieChart);
    }

    /*
    Changes the data from `pieChart` to be compatable with a bar chart graph.

    The data format needed is found here: http://cmaurer.github.io/angularjs-nvd3-directives/multi.bar.chart.html
    In our case, we need to output data that looks like this:

      [
        {
          "key": "Corporation",
          "values": [ ["Elissa Silverman", 0], ["Some other Guy", 1000], ...]
        },
        {
          "key": "Indivual",
          "values": [ ["Elissa Silverman", 1000], ["Some other Guy", 0], ...]
        },
        ...
      ]

      The input pie chart data looks like this:

      {
        "Elissa Silverman": {"Corporation": null, "Indivual": 1000},
        "Some other guy": {"Corporation": 1000, "Indivual": null},
      }
      */
    data.barChart = function () {
      var returnedData = [],
        candidate,
        category,
        amount;

      function pushAndReturn(list, item) {
        list.push(item);
        return list.last();
      }

      function findWhereOrPush(list, properties) {
        return _.findWhere(list, properties) || pushAndReturn(list, properties)
      }

      function addData(candidate, category, amount) {
        // We are building up the `returnedData` list

        // First find the object in the list for this type
        /// If it doesn't exist, create one
        _(findWhereOrPush(this.returnedData, {
          "key": category,
        }))
        // Then make sure that object has a values list
        .defaults({
          "values": []
        })
        // Then push the candidate, amount pair to the values of that category
        .values.push([candidate, amount])
      }

      // First we need to iterate the initial format tree
      for(candidate in this.pieChart) {
        for(category in this.pieChart[candidate]) {
          amount = this.pieChart[candidate][category];
          // Some of the candidates have `null` for some amounts, in which case
          // we don't want to add those amounts
          if(candidate && category && amount) {
            addData(candidate, category, amount);
          }
        }
      }
    }

    return data;
  }
]);
