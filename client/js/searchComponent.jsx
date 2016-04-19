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
            pathname: 'data',
            state: candidates
        };
        return (
            <div>
                <main>
                    <div className="row">
                        <div className="col-xs-9">
                            <h2>Campaign Search</h2>
                            <h4>How to search for campaign finance data on this website:</h4>
                            <ol>
								<li className="instruction-item">To search for specific types of campaigns
								within a certain date range, click on the "Search By Year and Race" tab. Note that you must choose both a type of race and a date range. 
								To search races by candidate name, click on the "Search by candidate name" tab .</li> 
								<li className="instruction-item">Select one or more of the races shown in the search results.
								You can view and edit these selections under the "Selections" tab (which will appear
								to the left of the "Search by candidate" tab after you choose search terms).</li> 
								<li className="instruction-item">To view data for the selected races, click on the "Go" button (which will appear in the upper right-hand corner of the page after you've selected a race).
								You will be taken to a page with:</li> 
								<ul>
									<li>Data and graphs about the amount of money raised for each race</li>
									<li>Information about the origin of each selected race's funds.</li>
									<li>An integrity score for each race</li> 
								</ul>
							</ol>
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
