'use strict';

var controllers = angular.module('myApp.controllers', []);

controllers.controller('SelectController', ['Campaigns', '$rootScope',
  function(Campaigns, $rootScope) {
    this.selectableOffice = {
      'City': ['Mayor', 'Council Chairman', 'Council At-Large'],
      'District': ['Council Ward1', 'Council Ward2']
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
