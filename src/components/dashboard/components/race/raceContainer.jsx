import React, { Component } from 'react';
import CandidatePanel from './candidatePanel.jsx';
import Client from '../../../api';
import { Col } from 'react-bootstrap';

class RaceContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: {},
      selectedCampaign: 0
    };
    this._loadCampaignData = this._loadCampaignData.bind(this);
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async _loadCampaignData(candidateId, campaignId) {

    const json = await Client.getCandidate({
      id: candidateId,
      campaigns: [{ campaignId: campaignId }]
    })

    let scores = this.state.scores;
    scores[campaignId] = json.campaigns[0]

    await this.setStateAsync({
      scores: scores,
      selectedCampaign: campaignId
    })

  }

  render() {
    const { races, loading, campaignData } = this.props;
    let scores = this.state.scores;
    let selectedCampaign = this.state.selectedCampaign;
    return (
      <div>
        {races.map((race, idx) => {
          return (
            <Col key={idx} xs={6}>
              <h3>{race.type}</h3>
              {race.campaigns.map((campaign, idx) => {
                return (
                  <CandidatePanel
                    selectedCampaign={selectedCampaign}
                    campaignData={campaignData}
                    campaign={campaign}
                    idx={idx}
                    scores={scores}
                    loading={loading}
                    loadCampaignData={() => {
                      this._loadCampaignData(
                        campaign.candidateId,
                        campaign.campaign.campaignId
                      );
                    }}
                  />
                );
              })}
            </Col>
          );
        })}
      </div>
    );
  }
}

export default RaceContainer;
