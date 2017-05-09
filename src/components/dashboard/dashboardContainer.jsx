import React from 'react';
import PropTypes from 'prop-types';
import Client from '../api';
import Moment from 'moment';
import Promise from 'bluebird';
import Dashboard from './components/dashboard.jsx';
const dateFormat = 'MM/DD/YYYY';

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      races: [],
      startDate: Moment('01/01/2014', dateFormat),
      endDate: Moment('01/01/2016', dateFormat),
      campaignData: [],
      loading: true
    };
    this._changeYearsViewed = this._changeYearsViewed.bind(this);
  }

  _getCampaigns(races) {
    const { startDate, endDate } = this.state;
    return races.map(race => {
      return Client.getCampaigns(race, {
        fromDate: startDate,
        toDate: endDate
      }).then(data => {
        return { type: race, data: data };
      });
    });
  }

  _getCampaignData(candidateId, campaignId) {
    return Client.getCandidate({
      id: candidateId,
      campaigns: [{ campaignId: campaignId }]
    }).then(data => {
      let campaignID = data.campaigns[0].campaignId;
      let obj = {};

      obj[campaignID] = data;
      return data;
    });
  }

  _loadAllCampaignData(races) {
    let combinedCampaigns = [];
    let data = [];
    this.setState({ loading: true });
    for (let i = 0; i < races.length; i++) {
      combinedCampaigns = combinedCampaigns.concat(races[i]['campaigns']);
    }

    return Promise.all(
      combinedCampaigns.map(campaign => {
        let campaignID = campaign.campaign.campaignId;
        let candidateID = campaign.candidateId;
        return this._getCampaignData(candidateID, campaignID).then(res => {
          data[campaignID] = res;
        });
      })
    ).then(() => {
      this.setState({ campaignData: data, loading: false });
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.loading == false && nextState.loading == false) {
      this._loadAllCampaignData(nextState.races);
    }
  }

  componentWillMount() {
    Client.getRaces()
      .then(races => {
        return Promise.all(this._getCampaigns(races));
      })
      .then(races => {
        const structuredData = races.map(r => {
          return {
            type: r.type,
            campaigns: r.data
              .map(c => {
                if (c.campaigns[0]) {
                  return {
                    candidateId: c.id,
                    candidateName: c.name,
                    campaign: c.campaigns[0]
                  };
                }
              })
              .filter(d => d !== undefined)
          };
        });
        this.setState({ races: structuredData });
      })
      .then(() => {
        let races = this.state.races;
        return this._loadAllCampaignData(races);
      });
  }

  _changeYearsViewed(selection) {
    let fromDate, toDate;
    switch (selection) {
      case '14-16':
        fromDate = Moment('01/01/2014', dateFormat);
        toDate = Moment('01/01/2016', dateFormat);
        break;
      case '12-14':
        fromDate = Moment('01/01/2012', dateFormat);
        toDate = Moment('01/01/2014', dateFormat);
        break;
      case '10-12':
        fromDate = Moment('01/01/2010', dateFormat);
        toDate = Moment('01/01/2012', dateFormat);
        break;
      case '08-10':
        fromDate = Moment('01/01/2008', dateFormat);
        toDate = Moment('01/01/2010', dateFormat);
        break;
      default:
        fromDate = Moment('01/01/2014', dateFormat);
        toDate = Moment('01/01/2016', dateFormat);
    }

    let that = this;
    Client.getRaces()
      .then(races => {
        return Promise.all(
          races.map(race => {
            return Client.getCampaigns(race, {
              fromDate: fromDate.format(dateFormat),
              toDate: toDate.format(dateFormat)
            }).then(data => {
              return { type: race, data: data };
            });
          })
        );
      })
      .then(races => {
        const structuredData = races.map(r => {
          return {
            type: r.type,
            campaigns: r.data
              .map(c => {
                if (c.campaigns[0]) {
                  return {
                    candidateId: c.id,
                    candidateName: c.name,
                    campaign: c.campaigns[0]
                  };
                }
              })
              .filter(d => d !== undefined)
          };
        });
        that.setState({ races: structuredData });
      });
  }

  render() {
    const { races, campaignData, loading } = this.state;

    return (
      <Dashboard
        changeYears={this._changeYearsViewed}
        races={races}
        campaignData={campaignData}
        loading={loading}
      />
    );
  }
}

export default DashboardContainer;

DashboardContainer.propTypes = {
  races: PropTypes.array,
  startDate: PropTypes.func,
  endDate: PropTypes.func,
  campaignData: PropTypes.array,
  loading: PropTypes.bool
};
