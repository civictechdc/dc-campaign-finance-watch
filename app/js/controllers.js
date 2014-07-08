'use strict';

var controllers = angular.module('myApp.controllers', []);

controllers.controller('SelectController', ['$scope', 'Campaigns', '$rootScope',
  function($scope, Campaigns, $rootScope) {
    $scope.selectableOffice = {
      'City': ['Mayor', 'Council Chairman', 'Council At-Large'],
      'District': ['Council Ward1', 'Council Ward2']
    };
    $scope.campaigns = Campaigns;
    $scope.campaigns.update();
    $rootScope.selected = {
      year: 2014,
      office: 'Council At-Large',
    };

    $scope.setOffice = function(office) {
      $rootScope.selected.office = office;
    };

    $scope.setYear = function(year) {
      $rootScope.selected.year = year;
    };


  }
]);

controllers.controller('GraphsController', ['$scope', '$rootScope', 'Records',
  function($scope, $rootScope, Records) {
    $scope.records = Records;
    $rootScope.$watchCollection('selected', $scope.records.update);

    function sum(a) {
      return _.reduce(a, function(memo, num) {
        return memo + num;
      }, 0);
    }

  }
]);
