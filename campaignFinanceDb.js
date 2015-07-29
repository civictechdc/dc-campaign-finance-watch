/** Code for setting up mongo driver connection */
var pmongo = require('promised-mongo');
var properties = require('properties')

module.exports = function() {


   var db = pmongo('mongodb://localhost:27017/dc-campaign-finance', ['candidates', 'contributions']); 
   return db;
}




