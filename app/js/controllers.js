'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('SelectController', ['$scope', 'Data', '$http',

    function ($scope, Data, $http) {
      $scope.data = Data;
      $scope.data.updateCampaigns();



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
      $scope.$watch('data.office', $scope.data.fetchContributions);
      $scope.$watch('data.year', $scope.data.fetchContributions);

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
