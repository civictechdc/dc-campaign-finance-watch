import _ from 'lodash';

let config = require('config');
const dateFormat = 'MM/DD/YYYY';

class Client {
  constructor(baseUrl, restClient) {
    this.baseUrl = baseUrl;
    this.Rest = restClient;
  }

  getCampaignData(campaignId) {
    return fetch(this.baseUrl + '/contributions/' + campaignId).then(rsp => {
      return rsp.json();
    });
  }

  getCandidates(toDate, fromDate) {
    const toDateString = toDate.format(dateFormat);
    const fromDateString = fromDate.format(dateFormat);
    return fetch(
      this.baseUrl +
        '/candidate' +
        '?toDate=' +
        toDateString +
        '&fromDate=' +
        fromDateString
    ).then(rsp => {
      return rsp.json();
    });
  }

  getCandidate(candidate) {
    const campaignSearch = _.join(
      candidate.campaigns.map(ca => {
        return 'campaigns=' + ca.campaignId;
      }),
      '&'
    );
    return fetch(
      this.baseUrl + '/candidate/' + candidate.id + '?' + campaignSearch
    ).then(rsp => {
      return rsp.json();
    });
  }

  getCampaigns(race, dateRange) {
    if (Object.keys(dateRange).length === 0) {
      return fetch(
        this.baseUrl + '/electionSearch' + '?raceType=' + race
      ).then(rsp => {
        return rsp.json();
      });
    }
    return fetch(
      this.baseUrl +
        '/electionSearch' +
        '?raceType=' +
        race +
        '&fromDate=' +
        dateRange.fromDate +
        '&toDate=' +
        dateRange.toDate
    ).then(rsp => {
      return rsp.json();
    });
  }

  getRaces() {
    return fetch(this.baseUrl + '/races').then(rsp => {
      return rsp.json();
    });
  }

  search(value) {
    return fetch(this.baseUrl + '/candidate?search=' + value).then(rsp => {
      return rsp.json();
    });
  }
}


const endPoints = {
  local: 'http://localhost:8001/dc-campaign-finance/api',
  prod: 'https://campaign-finance.codefordc.org/dc-campaign-finance/api'
};

let env = 'local';
if (config.default.api === 'production') {
  env = 'prod';
}

export default new Client(endPoints[env]);
