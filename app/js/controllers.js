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

controllers.controller('GraphsController', ['$scope', '$rootScope', 'Records',
  function($scope, $rootScope, Records) {
    $scope.records = Records;
    $scope.$watch('records.records', _.bind(function() {
      this.graph = Records.contributionType;
    }, this));
    $rootScope.$watchCollection('selected', function() {
      Records.update();
    });

  }
]);
