import React, {Component} from 'react'
import CandidatePanel from './candidatePanel.jsx'
import Client from '../../../api';
import {Accordion, Button, Col, Panel, Row} from 'react-bootstrap';

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
          const {scores} = this.props;
          scores[campaignId] = data.campaigns[0];
          this.setState({scores: scores});
      });
  }

  render() {
    const { races, loading, campaignData } = this.props;
    let scores = this.state.scores
      return(
        <div>
          {races.map((race, idx) => {
            return(
              <Col key={idx} xs={6}>
                  <h3>{race.type}</h3>
                  <Accordion>
                      {race.campaigns.map((campaign, idx) => {
                          return(
                            <CandidatePanel
                            campaign={campaign}
                            idx={idx}
                            scores={scores}
                            loading={loading}
                            onEnterHandler={() => {
                              console.log("handling onenter")
                                this._loadCampaignData(campaign.candidateId, campaign.campaign.campaignId)
                            }}
                            />
                          )
                      })}
                  </Accordion>
              </Col>
            )
          })}
        </div>
      )
  }
}

export default RaceContainer

// <Panel key={idx} eventKey={idx} header={header}>
//     <CandidateInfo info={scores[campaign.campaign.campaignId]}/>
//     <LinkContainer
//         to={`candidate/${campaign.candidateId}/campaign/${campaign.campaign.campaignId}`}>
//         <Button>Details</Button>
//     </LinkContainer>
// </Panel>
