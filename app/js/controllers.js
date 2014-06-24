'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('SelectController', ['$scope', 'Data', '$http',

    function ($scope, Data, $http) {
      $scope.data = Data;
      $scope.data.fetchCampaigns();

      $scope.officeContended = function (office) {
        return _.contains($scope.data.offices(), office);
      }


      $scope.setOffice = function (office) {
        $scope.data.office = office;
      }

      $scope.setYear = function (year) {
        $scope.data.year = year;
      }


    }
  ])
  .controller('GraphsController', ['$scope', 'Data',
    function ($scope, Data) {
      $scope.data = Data;
      $scope._ = _;
      $scope.$watch('data.office', $scope.data.fetchPieChart);
      $scope.$watch('data.year', $scope.data.fetchPieChart);

      function sum(a) {
        return _.reduce(a, function (memo, num) {
          return memo + num;
        }, 0);
      }

      $scope.totalContr = function (candidate) {
        return sum(_.values($scope.data.pieChart[candidate]));
      }
    }
  ]);
