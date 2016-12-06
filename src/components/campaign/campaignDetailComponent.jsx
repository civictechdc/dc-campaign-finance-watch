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
        this.state = { contributions: [], activeTab: 'visualizer' };
        this.setActiveTab = this.setActiveTab.bind(this);
        this.renderTabs = this.renderTabs.bind(this);
        this.goFullScreen = this.goFullScreen.bind(this);
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

    setActiveTab(tab){
        this.setState({activeTab: tab});
    }

    goFullScreen(tab) {
        this.setState({fullScreenTab: tab});
    }

    renderTabs() {
        const fullScreenStyle = {
                top: 0,
                bottom: 0,
                position: 'fixed',
                left: 0,
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                zIndex: 99999
        };

        const {activeTab, contributions, fullScreenTab} = this.state;
        const {id} = this.props.params;
        const vizTitle = <span>Visualiations <button style={{padding: '0', paddingLeft: '2px',  paddingRight: '2px'}} onClick={() => this.goFullScreen('visualizer')} disabled={activeTab !== 'visualizer'} className="btn btn-info btn-xs"><i className="fa fa-expand"></i></button></span>
        const tableTitle = <span>Contribution Table</span>
        
        if(fullScreenTab === 'visualizer') {
            return (
                <Tabs>
                    <Tab id="keshif"  eventKey={1} title={vizTitle} onEntered={() => this.setActiveTab('visualizer')}>
                        <div className="campaign-visualizer" >
                            <iframe
                                style={fullScreenStyle}
                                src={'http://adilyalcin.me/campaign-finance-explorer/index.html?' + id}>
                            </iframe>
                            <button
                                className="btn btn-info btn-xs"
                                onClick={() => this.goFullScreen('')}
                                style={{position: 'fixed', top: '2px', right: '10px', zIndex: 999999}}>
                                <i className="fa fa-compress"></i>
                            </button>
                        </div>
                    </Tab>
                    <Tab id="table" eventKey={2} title={tableTitle} onEntered={() => this.setActiveTab('table')}>
                        <CampaignTable contributions={contributions}/>
                    </Tab>
                </Tabs>
            )
        }

        return (
            <Tabs>
                <Tab id="keshif"  eventKey={1} title={vizTitle} onEntered={() => this.setActiveTab('visualizer')}>
                    <div className="campaign-visualizer" >
                        <iframe
                            style={fullScreenTab === 'visualizer' ? fullScreenStyle : {}}
                            src={'http://adilyalcin.me/campaign-finance-explorer/index.html?' + id}>
                        </iframe>
                    </div>
                </Tab>
                <Tab id="table" eventKey={2} title={tableTitle} onEntered={() => this.setActiveTab('table')}>
                    <CampaignTable contributions={contributions}/>
                </Tab>
            </Tabs>
        )
    }

    render() {
        const { contributions, campaignScore, candidate } = this.state;
        
        
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
                        {this.renderTabs()}
                    </Col>
                </Row>
            );
        }
        return (<h3>Loading...</h3>);
    }
}

export default CampaignDetailComponent;
