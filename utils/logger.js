//logger.js
//Utility class that will log requests

var bunyan = require('bunyan');

var logger =  bunyan.createLogger({
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
        }]
});

module.exports = logger;
