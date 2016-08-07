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
          campaignCount: 0,
          scoreLoading: false};
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

    _getCandidates() {
      const {startYear, endYear} = this.state;
      return Client.getCandidates(startYear, endYear)
        .then((candidates) => {
          // not working on node end.
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

    _addCampaignData(candidateId, campaignId) {
        Client.getCandidate({
            id: candidateId,
            campaigns: [{campaignId: campaignId}]
        })
        .then((data) => {
          let campaignData = this.state.campaignData
          let obj = this.state.campaignData
          let campaignID = data.campaigns[0].campaignId

          obj[campaignID]= data
          this.setState({campaignData: obj})
          return data;
        })
    }

    _loadAllCampaignData(races) {
      let candidateIDList = []
      let combinedCampaigns = []

      for (var i=0; i<races.length; i++) {
        combinedCampaigns = combinedCampaigns.concat(races[i]['campaigns'])
      }

      Promise.all(combinedCampaigns.map((campaign) => {
        let campaignID = campaign.campaign.campaignId;
        let candidateID = campaign.candidateId;

        return this._addCampaignData(candidateID, campaignID)

      }))
    }

    componentWillMount() {
        let that = this;
        const {startYear, endYear} = this.state;
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
              let campaignCount = 0
              for (var i = 0; i< races.length; i++) {
                campaignCount += races[i]['campaigns'].length
              }
              this.setState({
                campaignCount: campaignCount
              })
            })
            .then(() => {
              let races = this.state.races
              this.setState({scoreLoading: true})
              return this._loadAllCampaignData(races)
            })
            .then((data) => {
              this.setState({scoreLoading: false})
            })
    }

    shouldComponentUpdate(nextProps, nextState) {
      //104 renders fix tomorrow.
      // let campaignNum = 0;
      //
      // if (Object.keys(nextState.campaignData).length=== )
      //
      // if nextState.campaignData.length
      // console.log("comparing lengths")
      // console.log(Object.keys(nextState.campaignData).length)
      // console.log(Object.keys(this.state.campaignData).length)
      // console.log(nextState)
      // console.log(this.state)
      // console.log(nextState == this.state)
      // console.log(nextState.campaignData == this.state.campaignData)
      // console.log(nextState.campaignCount === this.state.campaignCount)
      if (this.state.scoreLoading == true) {
        return false;
      }
      return true;
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
        const { races, scores, campaignData } = this.state;
        console.log("rendering")
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
                                          let candidateName = campaign.candidateName
                                          let campaignID = campaign.campaign.campaignId
                                          let header = `${candidateName}`

                                            if(scores && scores[campaign.campaign.campaignId]) {
                                                return (
                                                    <Panel eventKey={idx} header={campaign.candidateName}>
                                                        <CandidateInfo info={scores[campaign.campaign.campaignId]}/>
                                                        <LinkContainer to={`candidate/${campaign.candidateId}/campaign/${campaign.campaign.campaignId}`}>
                                                            <Button>Details</Button>
                                                        </LinkContainer>
                                                    </Panel>
                                                )

                                            } else if (this.state.scoreLoading === false && campaignData[campaignID]) {
                                              let header = `${candidateName + campaignData[campaignID]['campaigns'][0]['scores']['total'].toFixed(2)}`
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
