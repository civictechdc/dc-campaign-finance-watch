import _ from 'lodash';

let config = require('config');
const dateFormat = 'MM/DD/YYYY';

class Client {
  constructor(baseUrl, restClient) {
    this.baseUrl = baseUrl;
    this.Rest = restClient;
  }

  async getCampaignData(campaignId) {
    try {
      const res = await fetch(this.baseUrl + '/contributions/' + campaignId)
      const json = await res.json()
      return json
    } catch (err) {
      console.log('fetch failed', err);
    }
  }

  async getCandidates(toDate, fromDate) {
    const toDateString = toDate.format(dateFormat);
    const fromDateString = fromDate.format(dateFormat);
    try {
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
    } catch (err) {
      console.log('fetch failed', err);
    }
  }

  async getCandidate(candidate) {
    const campaignSearch = _.join(
      candidate.campaigns.map(ca => {
        return 'campaigns=' + ca.campaignId;
      }),
      '&'
    );
    try {
      const res = await fetch(
        this.baseUrl + '/candidate/' + candidate.id + '?' + campaignSearch
      )
      const json = await res.json()
      return json
    } catch (err) {
      console.log('fetch failed', err);
    }

  }

  async getCampaigns(race, dateRange) {
    try {
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
          dateRange.fromDate.format(dateFormat) +
          '&toDate=' +
          dateRange.toDate.format(dateFormat)
      )
      const json = await res.json();
      return json;
    } catch (err) {
      console.log('fetch failed', err);
    }


  }

  async getRaces() {
    try {
      const res = await fetch(this.baseUrl + '/races')
      const json = await res.json();
      return json;
    } catch (err) {
      console.log('fetch failed', err);
    }
  }

  async search(value) {
    try {
      const res = await fetch(this.baseUrl + '/candidate?search=' + value)
      const json = await res.json();
      return json;
    } catch (err) {
      console.log('fetch failed', err);
    }
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
