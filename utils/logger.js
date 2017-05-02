//logger.js
//Utility class that will log requests

const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'finance-endpoints',
  streams: [
    {
      path: './endpoints.log',
      type: 'rotating-file',
      period: '1d',
      count: 3,
      level: 'trace'
    },
    {
      level: 'info',
      stream: process.stdout
    }
  ]
});

module.exports = logger;
