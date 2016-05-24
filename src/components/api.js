import Rest from 'restler';
import Promise from 'bluebird';
import _ from 'lodash';

let config = require('config');

var methodNamesToPromisify = "get post put del head patch json postJson putJson".split(" ");

function EventEmitterPromisifier(originalMethod) {
    // return a function
    return function promisified() {
        var args = [].slice.call(arguments);
        // Needed so that the original method can be called with the correct receiver
        var self = this;
        // which returns a promise
        return new Promise(function (resolve, reject) {
            // We call the originalMethod here because if it throws,
            // it will reject the returned promise with the thrown error
            var emitter = originalMethod.apply(self, args);

            emitter
                .on("success", function (data, response) {
                    resolve([data, response]);
                })
                .on("fail", function (data, response) {
                    // Erroneous response like 400
                    resolve([data, response]);
                })
                .on("error", function (err) {
                    reject(err);
                })
                .on("abort", function () {
                    reject(new Promise.CancellationError());
                })
                .on("timeout", function () {
                    reject(new Promise.TimeoutError());
                });
        });
    };
};

Promise.promisifyAll(Rest, {
    filter: function (name) {
        return methodNamesToPromisify.indexOf(name) > -1;
    },
    promisifier: EventEmitterPromisifier
});

class Client {
    constructor(baseUrl, restClient) {
        this.baseUrl = baseUrl;
        this.Rest = restClient;
    }

    getCampaignData(campaignId) {
        return this.Rest.getAsync(this.baseUrl + '/contributions/' + campaignId)
            .then((result) => {
                return result[0];
            });
    }

    getCandidates(toDate, fromDate) {
        let toDateString = toDate.format();
        let fromDateString = fromDate.format();
        return this.Rest
            .getAsync(this.baseUrl + '/candidate' + '?toDate=' + toDateString + '&fromDate=' + fromDateString)
            .then(function (result) {
                return result[0];
            });
    }

    getCandidate(candidate) {
        const campaignSearch = _.join(candidate.campaigns.map((ca) => {
            return 'campaigns=' + ca.campaignId;
        }), '&');
        return this.Rest.getAsync(this.baseUrl + '/candidate/' + candidate.id + '?' + campaignSearch);
    }

    getCampaigns(race, dateRange) {
        if(!dateRange) {
            return this.Rest.getAsync(this.baseUrl + '/electionSearch' + '?raceType=' + race);
        }
        return this.Rest.getAsync(this.baseUrl + '/electionSearch' + '?raceType=' + race + '&fromDate=' + dateRange.fromDate.format() + '&toDate=' + dateRange.toDate.format());
    }

    getRaces() {
        return this.Rest.getAsync(this.baseUrl + '/races');
    }

    search(value) {
        return this.Rest.getAsync(this.baseUrl + '/candidate?search=' + value)
            .then(function (result) {
                return result[0];
            });
    }

    convertSvg(svg) {
        let data = {svg: (new XMLSerializer).serializeToString(svg)};
        return this.Rest.postAsync(this.baseUrl + '/visualization', {data: data});
    }
}

let endPoints = {
    local: 'http://localhost:8001/dc-campaign-finance/api',
    prod: 'http://ec2-52-73-208-76.compute-1.amazonaws.com/dc-campaign-finance/api'
};

let env = 'local';
console.log()
if(config.default.api === 'production') {
    env = 'prod';
}
console.log(endPoints[env]);

export default new Client(endPoints[env], Rest);
