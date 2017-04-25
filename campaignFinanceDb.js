/** Code for setting up mongo driver connection */
const pmongo = require('promised-mongo');

module.exports = function() {
  return pmongo('mongodb://localhost:27017/dc-campaign-finance', [
    'candidates',
    'contributions'
  ]);
};
