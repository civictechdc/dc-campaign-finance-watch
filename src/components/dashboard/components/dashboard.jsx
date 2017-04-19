import {Component} from 'react'
import yearFilter from './yearFilter.jsx'

class Dashboard extends Component {


  render() {
      const { races, scores, campaignData, loading } = this.props;
      return (
          <Row>
              <Col xs={12}>
                  <h2>DC Campaign Finance Watch</h2>
                  <Row>
                      <Col xs={12}>
                          <YearFilter />
                      </Col>
                  </Row>
                  <Row>
                      {races.map((race, idx) => {
                          return (
                              <Col key={idx} xs={6}>
                                  <h3>{race.type}</h3>
                                  <Accordion>
                                      {race.campaigns.map((campaign, idx) => {
                                        let candidateName = campaign.candidateName.trim()
                                        let campaignID = campaign.campaign.campaignId
                                        let header = `${candidateName}`
                                          if(scores && scores[campaign.campaign.campaignId]) {
                                              let header = this._loadPanelHeader(campaignData, campaignID, candidateName)

                                              return (
                                                  <Panel eventKey={idx} header={header}>
                                                      <CandidateInfo info={scores[campaign.campaign.campaignId]}/>
                                                      <LinkContainer to={`candidate/${campaign.candidateId}/campaign/${campaign.campaign.campaignId}`}>
                                                          <Button>Details</Button>
                                                      </LinkContainer>
                                                  </Panel>
                                              )

                                          } else if (!loading) {
                                            let header = this._loadPanelHeader(campaignData, campaignID, candidateName)

                                            return (
                                            <Panel eventKey={idx} header={header}
                                              onEnter={() => {
                                                this._loadCampaignData(campaign.candidateId, campaign.campaign.campaignId)
                                              }
                                              }>
                                                Loading...
                                            </Panel>
                                            )
                                          }
                                          return (
                                              <Panel eventKey={idx} header={header}
                                                onEnter={() => {
                                                  this._loadCampaignData(campaign.candidateId, campaign.campaign.campaignId)
                                                }
                                                }>
                                                  Loading...
                                              </Panel>
                                          )
                                      })}
                                  </Accordion>
                              </Col>
                          )
                      })}
                  </Row>
              </Col>
          </Row>
      );
  }
}
