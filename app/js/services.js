'use strict';

/* Services */


var myAppServices = angular.module('myApp.services', []);


myAppServices.factory('Data', ['$resource', '$http',
  function ($resource, $http) {
    var data = {
      year: 2014,
      office: "Mayor",
      cityWideOffices: ['Mayor', 'Council Chairman', 'Council At-Large'],
      districtWideOffices: ['Council Ward1', 'Council Ward2'],
      api_url: '//rawgit.com/codefordc/finance/gh-pages/data/output',

      updateCampaigns: function () {
        var scope = this;

        $http.get(this.api_url + '/election_years_and_offices.json', {
          cache: true,
        }).success(function (response) {
          scope.campaigns = response;
        })
      },
      get years() {
        if(!this.campaigns) {
          return [];
        }
        return _.chain(this.campaigns)
          .pluck('Election Year')
          .uniq(true)
          .value()
          .reverse();
      },
      get offices() {
        if(!this.campaigns) {
          return [];
        }
        return _.chain(this.campaigns)
          .where({
            'Election Year': this.year
          })
          .pluck('Office')
          .value();
      },
      officeContended: function (office) {
        return _.contains(this.offices, office);
      }
    };


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
