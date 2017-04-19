import {Component} from 'react';
import { Row, Col, Accordion, Panel, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Client from '../api';
import Moment from 'moment';
import Promise from 'bluebird';
import {CandidateInfo} from '../candidateCard.component.jsx';

class DashboardContainer extends Component {
  constructor(props) {
  super(props);
  this.state = {
    races: [],
    scores: {},
    startYear: Moment('01/01/2014'),
    endYear: Moment('01/01/2016'),
    campaignData: [],
    loading: true
    };
  this._loadCampaignData = this._loadCampaignData.bind(this);
  this._changeYearsViewed = this._changeYearsViewed.bind(this);
  }

  _getCampaigns(races) {
    const {startYear, endYear} = this.state;
    return races.map((race) => {
        return Client.getCampaigns(race, {fromDate: startYear, toDate: endYear})
            .then((data) => {
                return {type: race, data: data};
            });
    })
  }

  _loadCampaignData(candidateId, campaignId) {
      Client.getCandidate({
          id: candidateId,
          campaigns: [{campaignId: campaignId}]
      })
      .then((data) => {
          const {scores} = this.state;
          scores[campaignId] = data.campaigns[0];
          this.setState({scores: scores});
      });
  }

  _getCampaignData(candidateId, campaignId) {
      return Client.getCandidate({
          id: candidateId,
          campaigns: [{campaignId: campaignId}]
      })
      .then((data) => {
        let campaignID = data.campaigns[0].campaignId
        let obj = {}

        obj[campaignID]= data
        return data;
      })
  }

  _loadAllCampaignData(races) {
    let combinedCampaigns = []
    let data = []

    for (var i=0; i<races.length; i++) {
      combinedCampaigns = combinedCampaigns.concat(races[i]['campaigns'])
    }

    return Promise.all(
      combinedCampaigns.map((campaign) => {
      let campaignID = campaign.campaign.campaignId;
      let candidateID = campaign.candidateId;
      return this._getCampaignData(candidateID, campaignID)
        .then((res)=> {
          data[campaignID] = res
        })

    }))
    .then(() => {
      this.setState({campaignData: data, loading: false})
    })
  }

  componentWillMount() {
      // let that = this;
      Client
          .getRaces()
          .then((races) => {
            return Promise.all(this._getCampaigns(races));
          })
          .then((races) => {
              const structuredData = races.map((r) => {
                  return {
                      type: r.type,
                      campaigns: r.data.map((c) => {
                          if(c.campaigns[0]) {
                              return {
                                  candidateId: c.id,
                                  candidateName: c.name,
                                  campaign: c.campaigns[0]
                              }
                          }
                      }).filter(d => d !== undefined)
                  }
              });
              this.setState({races: structuredData})
          })
          .then(() => {
            let races = this.state.races
            return this._loadAllCampaignData(races)
          })
  }

  render() {
      const { races, scores, campaignData, loading } = this.state;
      return (
          <Dashboard
          races={races}
          scores={scores}
          campaignData={campaignData}
          lading={loading}
          />
      );
  }
}
export default DashboardContainer;
