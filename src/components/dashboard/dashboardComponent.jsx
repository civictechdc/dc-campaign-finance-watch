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
        this.state = {races: [], scores: {}, startYear: Moment('01/01/2014'), endYear: Moment('01/01/2016')};
        this._loadCampaignData = this._loadCampaignData.bind(this);
        this._changeYearsViewed = this._changeYearsViewed.bind(this);
    }

    componentWillMount() {
        let that = this;
        const {startYear, endYear} = this.state;
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

    render() {
        const { races, scores } = this.state;
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
                                            if(scores && scores[campaign.campaign.campaignId]) {
                                                return (
                                                    <Panel eventKey={idx} header={campaign.candidateName}>
                                                        <CandidateInfo info={scores[campaign.campaign.campaignId]}/>
                                                        <LinkContainer to={`candidate/${campaign.candidateId}/campaign/${campaign.campaign.campaignId}`}>
                                                            <Button>Details</Button>
                                                        </LinkContainer>
                                                    </Panel>
                                                )

                                            }
                                            return (
                                                <Panel eventKey={idx} header={campaign.candidateName}  onEnter={() => this._loadCampaignData(campaign.candidateId, campaign.campaign.campaignId)}>
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
