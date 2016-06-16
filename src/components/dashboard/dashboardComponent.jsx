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
        this.state = {races: [], scores: {}};
        this._loadCampaignData = this._loadCampaignData.bind(this);
    }

    componentWillMount() {
        let that = this;
        const startYear = Moment('01/01/2014');
        const endYear = Moment('01/01/2016');
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
                            Viewing Years: 2014 - 2015
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
