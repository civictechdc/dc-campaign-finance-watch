'use strict';

var controllers = angular.module('myApp.controllers', []);

controllers.controller('SelectController', ['Campaigns', '$rootScope',
  function(Campaigns, $rootScope) {
    this.selectableOffice = {
      'Office': ['Mayor', 'Council Chairman', 'Council At-Large', 'Council Ward 1', 'Council Ward 2', 'Council Ward 3', 'Council Ward 4', 'Council Ward 5', 'Council Ward 6', 'Council Ward 7', 'Council Ward 8' ],
      'District': []
    };
    Campaigns.update();
    this.campaigns = Campaigns;
    $rootScope.selected = {
      year: 2014,
      office: 'Council At-Large',
    };

    this.setOffice = function(office) {
      $rootScope.selected.office = office;
    };

    this.setYear = function(year) {
      $rootScope.selected.year = year;
    };

    this.officeIsActive = function(office) {
      return $rootScope.selected.office === office;
    };

    this.yearIsActive = function(year) {
      return $rootScope.selected.year === year;
    };

  }
]);

controllers.controller('GraphsController', ['$rootScope', '$scope', 'Records',
  function($rootScope, $scope, Records) {
    $rootScope.$watchCollection('selected', function() {
      Records.update();
    });
    $scope.Records = Records;
    $scope.$watch('Records.records', function() {
      $scope.Records.updateContributionType();
    });

    $scope.$watch('Records.contributionType', function(newValue) {
      $scope.config.series = newValue.series;
      $scope.config.xAxis = {
        categories: newValue.categories
      };
    });

    $scope.config = {
      options: {
        chart: {
          type: 'bar'
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Cash Contributed ($)'
          }
        },
        legend: {
          reversed: true
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
      }
    };
  }
]);
