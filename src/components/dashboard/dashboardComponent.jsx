import React from 'react';
import { Row, Col, Accordion, Panel, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Client from '../api';
import Moment from 'moment';
import Promise from 'bluebird';
import {CandidateInfo} from '../candidateCard.component.jsx';

class Dashboard extends React.Component {
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

    // not working on node end.
    _getCandidates() {
      const {startYear, endYear} = this.state;
      return Client.getCandidates(startYear, endYear)
        .then(() => {
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

    _loadPanelHeader(campaignData,campaignID, candidateName) {
        let candidateScore = campaignData[campaignID]['campaigns'][0]['scores']['total'].toFixed(2)
        let scoreColor = 'black'

        if (candidateScore < 40) {
        scoreColor = '#d43f3a'
        }
        else if (candidateScore >= 40 && candidateScore < 70) {
        scoreColor = '#ec971f'
        }
        else {
        scoreColor = '#5cb85c'
        }

        let style = {
        color: scoreColor
        }
        let header = (
            <div>{candidateName} - <span style={style}>{candidateScore}</span></div>
        )
        return header
    }

    componentWillMount() {
        let that = this;
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
                that.setState({races: structuredData})
            })
            .then(() => {
              let races = this.state.races
              return this._loadAllCampaignData(races)
            })
    }

    _changeYearsViewed(selection) {
        let startYear, endYear;
        switch(selection) {
            case '14-16':
                startYear =  Moment('01/01/2014');
                endYear =   Moment('01/01/2016');
                break;
            case '12-14':
                startYear =  Moment('01/01/2012');
                endYear =   Moment('01/01/2014');
                break;
            case '10-12':
                startYear =  Moment('01/01/2010');
                endYear =   Moment('01/01/2012');
                break;
            case '08-10':
                startYear =  Moment('01/01/2008');
                endYear =   Moment('01/01/2010');
                break;
            default:
                startYear =  Moment('01/01/2014');
                endYear =   Moment('01/01/2016');
        }

        let that = this;
        Client
            .getRaces()
            .then((races) => {
                return Promise.all(races.map((race) => {
                    return Client.getCampaigns(race, {fromDate: startYear, toDate: endYear})
                        .then((data) => {
                            return {type: race, data: data};
                        });
                }));
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
                that.setState({races: structuredData})
            });
    }




    render() {
        const { races, scores, campaignData, loading } = this.state;

        return (
            <Row>
                <Col xs={12}>
                    <h2>DC Campaign Finance Watch</h2>
                    <Row>
                        <Col xs={12}>
                            Viewing Years:
                            <select name="years" onChange={(evt) => this._changeYearsViewed(evt.target.value)}>
                                <option value="14-16">2014 - 2016</option>
                                <option value="12-14">2012 - 2014</option>
                                <option value="10-12">2010 - 2012</option>
                                <option value="08-10">2008 - 2010</option>
                            </select>
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

export default Dashboard;
