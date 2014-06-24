'use strict';

/* jasmine specs for services go here */

describe('service', function () {
  beforeEach(module('myApp.services'));


  describe('data', function () {
    it('should return an object', inject(function (Data) {
      expect(Data.year).toEqual(2014);
    }));
  });
});
