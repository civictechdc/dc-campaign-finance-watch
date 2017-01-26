var redis = require('redis');
var bluebird = require('bluebird');
var jsonify = require('redis-jsonify');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var client = jsonify(redis.createClient({
  host: 'redis'
}));

exports.client = client;
