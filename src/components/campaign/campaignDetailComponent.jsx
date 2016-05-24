import React from 'react';
import Client from '../api';
import { Row, Col } from 'react-bootstrap';
import { Table, Column, Cell } from 'fixed-data-table';
import Moment from 'moment';
import CampaignInfo from './campaignScorecard.jsx';
import Promise from 'bluebird';

class CampaignDetailComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = { contributions: [] };
    }

    componentWillMount(props) {
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
        console.log(campaignScore);
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
                        <Table rowsCount={contributions.length}
                            rowHeight={50}
                            headerHeight={50}
                            width={900}
                            height={500}>
                                <Column header={<Cell>Name</Cell>}
                                    cell={props => (
                                        <Cell {...props}>{contributions[props.rowIndex].contributor.name}</Cell>
                                    )}
                                    width={200}
                                />
                                <Column header={<Cell>Address</Cell>}
                                    cell={props => (
                                        <Cell {...props}>{contributions[props.rowIndex].contributor.address.raw}</Cell>
                                    )}
                                    width={300}
                                />
                                <Column header={<Cell>Amount</Cell>}
                                    cell={props => (
                                        <Cell {...props}>${contributions[props.rowIndex].amount}</Cell>
                                    )}
                                    width={100}
                                />
                                <Column header={<Cell>Contributor Type</Cell>}
                                    cell={props => (
                                        <Cell {...props}>{contributions[props.rowIndex].contributor.contributorType}</Cell>
                                    )}
                                    width={100}
                                />
                                <Column header={<Cell>Date</Cell>}
                                    cell={props => (
                                        <Cell {...props}>{Moment(contributions[props.rowIndex].date).format('MM/DD/YYY')}</Cell>
                                    )}
                                    width={200}
                                />
                        </Table>
                    </Col>
                </Row>
            );
        }
        return false;
    }
}

export default CampaignDetailComponent;
