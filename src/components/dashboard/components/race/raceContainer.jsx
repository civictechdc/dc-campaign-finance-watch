import React, {Component} from 'react'
import CandidatePanel from './candidatePanel.jsx'
import Client from '../../../api';
import {Accordion, Button, Col, Panel, Row, PanelGroup} from 'react-bootstrap';

class RaceContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
        scores: {}
    }
    this._loadCampaignData = this._loadCampaignData.bind(this);
  }

  _loadCampaignData(candidateId, campaignId) {
    console.log('loading campaign adata')
      Client.getCandidate({
          id: candidateId,
          campaigns: [{campaignId: campaignId}]
      })
      .then((data) => {
        console.log("display data")
        console.log(data)
          // const {scores} = this.props;
          let scores = this.state.scores
          scores[campaignId] = data.campaigns[0];
          this.setState({scores: scores});
      });
  }

  render() {
    const { races, loading, campaignData } = this.props;
    let scores = this.state.scores
    console.log("trying to display scores")
    console.log(scores)
      return(
        <div>
          {races.map((race, idx) => {
            return(
              <Col key={idx} xs={6}>
                  <h3>{race.type}</h3>
                      {race.campaigns.map((campaign, idx) => {
                        return (
                          <CandidatePanel
                          campaign={campaign}
                          idx={idx}
                          scores={scores}
                          loading={loading}
                          onEnterHandler={() => {
                            console.log("handling onenter")
                              this._loadCampaignData(campaign.candidateId, campaign.campaign.campaignId)
                          }}/>
                        )
                      })}
              </Col>
            )
          })}
        </div>
      )
  }
}

export default RaceContainer
