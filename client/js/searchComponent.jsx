import React from 'react';
import CandidateSearchComponent from './candidateSearchComponent.jsx';
import LoaderComponent from './loader.component.jsx';
import { Tabs, Tab, Row, Col, ButtonToolbar, Button, Badge, Well } from 'react-bootstrap';
import { Link } from 'react-router';
import RaceSearch from './search/raceSearchComponent.jsx';
import _ from 'lodash';

class SearchComponent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {candidates: {}, activeTab: 1};
    }
    _handleCampaignSelection (name, candidateId, campaignId) {
        const { candidates } = this.state;

        if(candidates[candidateId]) {
            candidates[candidateId].campaigns.unshift(campaignId);
        } else {
            candidates[candidateId] = {
                name: name,
                campaigns: [campaignId],
                id: candidateId
            };
        }
        this.setState({candidates: candidates});
    }

    handleSelect(key) {
        this.setState({activeTab: key});
    }

    _removeCampaign(candidateId, campaign) {
        const { candidates, activeTab } = this.state;
        const candidate = candidates[candidateId];
        candidate.campaigns = candidate.campaigns.filter((ca) => {
            return ca !== campaign;
        });
        let cleanCandidates = candidates;
        if(candidate.campaigns.length > 0) {
            cleanCandidates[candidateId] = candidate;
        } else {
            delete cleanCandidates[candidateId];
        }

        const newActiveTab = _.isEmpty(cleanCandidates) ? 1 : activeTab;

        this.setState({candidates: cleanCandidates, activeTab: newActiveTab});
    }

    render () {
        const { candidates, activeTab } = this.state;
        const locationDescriptor = {
            pathname: '/dc-campaign-finance-watch/client/data',
            state: candidates
        };
        return (
            <div>
                <main>
                    <div className="row">
                        <div className="col-xs-9">
                            <h2>Campaign Search</h2>
                            <h5>Selected campaigns will appear in the "Selections" tab.</h5>
                        </div>
                        <div className="col-xs-3">
                            {
                                _.isEmpty(candidates) ? false : <Link to={locationDescriptor}><Button bsStyle="primary" bsSize="large">Go<i className="fa fa-search-plus"></i></Button></Link>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <Tabs activeKey={activeTab} onSelect={this.handleSelect.bind(this)}>
                                <Tab eventKey={1} title="Search By Year and Race" tabClassName="search-tab">
                                    <RaceSearch selections={candidates} handleCampaignSelection={this._handleCampaignSelection.bind(this)}></RaceSearch>
                                </Tab>
                                <Tab tabClassName="search-tab" eventKey={2} title="Search by candidate name">
                                    <CandidateSearchComponent selections={candidates} handleCampaignSelection={this._handleCampaignSelection.bind(this)}/>
                                </Tab>
                                {
                                    _.isEmpty(candidates) ? false :
                                    <Tab tabClassName="search-tab" eventKey={3} title="Selections">
                                        <Row>
                                            <Col xs={12}>
                                                <h4>Candidates/Campaigns to create date for: </h4>
                                                {
                                                    _.map(candidates, (value, key) => {
                                                        if(value.campaigns.length > 0) {
                                                            return (
                                                                <Row key={key}>
                                                                    <Col xs={3}>
                                                                        <h5>{value.name}</h5>
                                                                    </Col>
                                                                    <Col xs={9}>
                                                                        <ButtonToolbar>
                                                                        {
                                                                            value.campaigns.map((ca, idx) => {
                                                                                return (
                                                                                    <Button key={idx} bsSize="small">{ca.raceTypeDetail} {ca.year} <Badge  pullRight onClick={() => this._removeCampaign(value.id, ca)}><i className="fa fa-times"></i></Badge></Button>
                                                                                );
                                                                            })
                                                                        }
                                                                        </ButtonToolbar>
                                                                    </Col>
                                                                </Row>
                                                            );
                                                        }
                                                    })
                                                }
                                            </Col>
                                        </Row>
                                    </Tab>
                                }
                            </Tabs>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default SearchComponent;
