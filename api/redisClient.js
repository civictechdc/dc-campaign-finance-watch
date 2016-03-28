var redis = require('redis');
var bluebird = require('bluebird');
var jsonify = require('redis-jsonify');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client = jsonify(redis.createClient());

exports.client = client;
