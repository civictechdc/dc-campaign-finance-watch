import _ from 'lodash';

let config = require('config');
const dateFormat = 'MM/DD/YYYY';

class Client {
  constructor(baseUrl, restClient) {
    this.baseUrl = baseUrl;
    this.Rest = restClient;
  }

  async getCampaignData(campaignId) {
    const res = await fetch(this.baseUrl + '/contributions/' + campaignId)
    const json = await res.json()
    return json
  }

  async getCandidates(toDate, fromDate) {
    const toDateString = toDate.format(dateFormat);
    const fromDateString = fromDate.format(dateFormat);
    const res = await fetch(
      this.baseUrl +
        '/candidate' +
        '?toDate=' +
        toDateString +
        '&fromDate=' +
        fromDateString
    )
    const json = await res.json()
    return json
  }

  async getCandidate(candidate) {
    const campaignSearch = _.join(
      candidate.campaigns.map(ca => {
        return 'campaigns=' + ca.campaignId;
      }),
      '&'
    );
    const res = await fetch(
      this.baseUrl + '/candidate/' + candidate.id + '?' + campaignSearch
    )
    const json = await res.json()
    return json
  }

  async getCampaigns(race, dateRange) {
    if (Object.keys(dateRange).length === 0) {
      const res = await fetch(
        this.baseUrl + '/electionSearch' + '?raceType=' + race
      )
      const json = await res.json();
      return json;
    }
    const res = await fetch(
      this.baseUrl +
        '/electionSearch' +
        '?raceType=' +
        race +
        '&fromDate=' +
        dateRange.fromDate +
        '&toDate=' +
        dateRange.toDate
    )
    const json = await res.json();
    return json;
  }

  async getRaces() {
    const res = await fetch(this.baseUrl + '/races')
    const json = await res.json();
    return json;
  }

  async search(value) {
    const res = await fetch(this.baseUrl + '/candidate?search=' + value)
    const json = await res.json();
    return json;
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
