/** Code for setting up mongo driver connection */
var pmongo = require('promised-mongo');
var properties = require('properties')

module.exports = function() {


   var db = pmongo('mongodb://dc-campaign-finance:codefordc@ds041380.mongolab.com:41380/dc-campaign-finance', ['candidates', 'contributions']); 
   return db;
}




