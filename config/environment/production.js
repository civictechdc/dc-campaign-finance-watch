'use strict';

module.exports = {
  mongo: {
    uri: 'mongodb://' +
      process.env.MONGO_USER +
      ':' +
      process.env.MONGO_PW +
      '@ds045632.mongolab.com:45632/dc-campaign-finance'
  },
  baseUrl: '0.0.0.0:8001/dc-campaign-finance/api'
};
