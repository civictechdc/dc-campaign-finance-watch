'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _restler = require('restler');

var _restler2 = _interopRequireDefault(_restler);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var methodNamesToPromisify = "get post put del head patch json postJson putJson".split(" ");

function EventEmitterPromisifier(originalMethod) {
    // return a function
    return function promisified() {
        var args = [].slice.call(arguments);
        // Needed so that the original method can be called with the correct receiver
        var self = this;
        // which returns a promise
        return new _bluebird2.default(function (resolve, reject) {
            // We call the originalMethod here because if it throws,
            // it will reject the returned promise with the thrown error
            var emitter = originalMethod.apply(self, args);

            emitter.on("success", function (data, response) {
                resolve([data, response]);
            }).on("fail", function (data, response) {
                // Erroneous response like 400
                resolve([data, response]);
            }).on("error", function (err) {
                reject(err);
            }).on("abort", function () {
                reject(new _bluebird2.default.CancellationError());
            }).on("timeout", function () {
                reject(new _bluebird2.default.TimeoutError());
            });
        });
    };
};

_bluebird2.default.promisifyAll(_restler2.default, {
    filter: function filter(name) {
        return methodNamesToPromisify.indexOf(name) > -1;
    },
    promisifier: EventEmitterPromisifier
});

var Client = function () {
    function Client(baseUrl, restClient) {
        _classCallCheck(this, Client);

        this.baseUrl = baseUrl;
        this.Rest = restClient;
    }

    _createClass(Client, [{
        key: 'getCandidates',
        value: function getCandidates(toDate, fromDate) {
            var toDateString = toDate.format();
            var fromDateString = fromDate.format();
            return this.Rest.getAsync(this.baseUrl + '/candidate' + '?toDate=' + toDateString + '&fromDate=' + fromDateString).then(function (result) {
                return result[0];
            });
        }
    }, {
        key: 'getCandidate',
        value: function getCandidate(candidate, dateRange) {
            return this.Rest.getAsync(this.baseUrl + '/candidate/' + candidate.id + '?fromDate=' + dateRange.fromDate.format() + '&toDate=' + dateRange.toDate.format());
        }
    }, {
        key: 'search',
        value: function search(value) {
            return this.Rest.getAsync(this.baseUrl + '/candidate?search=' + value).then(function (result) {
                return result[0];
            });
        }
    }, {
        key: 'convertSvg',
        value: function convertSvg(svg) {
            var data = { svg: new XMLSerializer().serializeToString(svg) };
            console.log(data);
            return this.Rest.postAsync(this.baseUrl + '/visualization', { data: data });
        }
    }]);

    return Client;
}();

var endPoints = {
    local: 'http://localhost:3000/dc-campaign-finance/api',
    prod: 'http://dc-finance-backend.herokuapp.com/dc-campaign-finance/api'
};

_config2.default.env = _config2.default.env || 'local';

exports.default = new Client(endPoints[_config2.default.env], _restler2.default);