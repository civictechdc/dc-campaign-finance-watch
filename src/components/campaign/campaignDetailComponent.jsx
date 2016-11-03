import React from 'react';
import Client from '../api';
import { Row, Col } from 'react-bootstrap';
import { Table, Column, Cell } from 'fixed-data-table';
import Moment from 'moment';
import CampaignInfo from './campaignScorecard.jsx';
import Promise from 'bluebird';
import CampaignTable from './campaignTable.jsx';
import { Tabs, Tab} from 'react-bootstrap';

class CampaignDetailComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = { contributions: [] };
    }

    componentWillMount() {
        const { id, candidateId } = this.props.params;
        let that = this;
        const detailsPromise = Client.getCampaignData(id);
        const scorePromise = Client.getCandidate({id: candidateId, campaigns: [{campaignId: id}]});
        Promise.join(detailsPromise, scorePromise, function(details, score){
            that.setState({contributions: details, campaignScore: score.campaigns[0], candidate: score.candidate});
        });
    }

    render() {
        const { contributions, campaignScore, candidate } = this.state;
        const {id} = this.props.params
        if(contributions && campaignScore) {
            return (
                <Row>
                    <Col xs={12}>
                        <Row>
                            <Col xs={12}>
                                <h2>{candidate.name}</h2>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={3}>
                        <CampaignInfo info={campaignScore}></CampaignInfo>
                    </Col>
                    <Col xs={9}>
                        <Tabs>
                            <Tab id="keshif" eventKey={1} title="Campaign Data Visualization">
                                <div className="campaign-visualizer">
                                    <iframe src={'http://adilyalcin.me/campaign-finance-explorer/index.html?' + id}></iframe>
                                </div>
                            </Tab>
                            <Tab id="table" eventKey={2} title="Contribution Table">
                                <CampaignTable contributions={contributions}/>
                            </Tab>
                        </Tabs>
                        
                    </Col>
                </Row>
            );
        }
        return (<h3>Loading...</h3>);
    }
}

export default CampaignDetailComponent;
