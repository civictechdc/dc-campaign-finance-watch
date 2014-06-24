'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
  beforeEach(module('myApp.controllers'));


  describe('SelectController', function () {
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('SelectController', {
        $scope: scope
      });
    }));


    it('should set "year" with "setYear"', function () {
      scope.setYear(2014);
      expect(scope.data.year).toBe(2014);
      scope.setYear(2013);
      expect(scope.data.year).toBe(2013);
    });

    it('should set "office" with "setOffice"', function () {
      scope.setOffice("mayor");
      expect(scope.data.office).toBe('mayor');
      scope.setOffice('at large');
      expect(scope.data.office).toBe('at large');
    });

    it('should show active offices per year with "officeContended"', function () {
      scope.data.years = {
        2014: ['mayor'],
        2013: ['office'],
      }
      scope.year = 2014;
      expect(scope.officeContended('mayor')).toBeTruthy;
      expect(scope.officeContended('office')).toBeFalsy;
      scope.year = 2013;
      expect(scope.officeContended('office')).toBeTruthy;
      expect(scope.officeContended('mayor')).toBeFalsy;
    });

    it('should set the default value of year model', function () {
      expect(scope.year).toBe(2014);
    });

  });
});
