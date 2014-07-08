'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('myApp.services'));


  describe('data', function() {
    it('should return an object', function() {
      var records = [{
          "Contribution Type": "Check",
          "Zip": "20011",
          "Contributor Type": "Individual",
          "Date of Receipt": "2/1/2014",
          "Address": "6101 16th St NW 514",
          "Employer Address": "",
          "Contributor": "Nicholas, Carolyn",
          "Committee Name": "Bonds for Council 2014",
          "Amount": "$50.00",
          "Candidate Name": "Anita Bonds",
          "city": "Washington",
          "state": "DC",
          "Employer Name": "Long and Foster"
        }, ],
        expectedOutput = [{
          "key": "Individual",
          "values": [
            ["Anita Bonds", 50],
          ]
        }, ];

      expect(contributionsFromRecords(records)).toEqual(expectedOutput);
    });
  });
});
