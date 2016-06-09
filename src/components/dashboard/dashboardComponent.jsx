import React from 'react';
import { Row, Col, Accordion, Panel } from 'react-bootstrap';
import Client from '../api';
import Moment from 'moment';
import Promise from 'bluebird';


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {races: []};
    }

    componentWillMount() {
        let that = this;
        const startYear = Moment('01/01/2015');
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
                that.setState({races: races})
            });
    }

    render() {
        const { races } = this.state;
        return (
            <Row>
                <Col xs={12}>
                    <h2>DC Campaign Finance Watch</h2>
                    <Row>
                        <Col xs={12}>
                            Viewing Year: 2015
                        </Col>
                    </Row>
                    <Row>
                        {races.map((race, idx) => {
                            return (
                                <Col key={idx} xs={12}>
                                    <h3>{race.type}</h3>
                                    <Accordion>
                                        {race.data.map((campaign, idx) =>{
                                            return (
                                                <Panel eventKey={idx} header={campaign.name}>
                                                    Scorecard goes here
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
