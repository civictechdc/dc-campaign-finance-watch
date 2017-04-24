/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React from 'react';
import _ from 'lodash';
import client from '../api';
import { Row, Col, ButtonToolbar, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import DateRangeComponent from '../dateRange.jsx';
import LoaderComponent from '../loader.component.jsx';

class RaceSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          races: [],
          campaigns: [],
          range: {},
          selectedRace: ''
        };
    }

    componentWillMount() {
        var that = this;
        client.getRaces()
            .then(function(races){
                races.unshift('Select a race type');
                that.setState({races: races});
            })
            .catch(function(err){
                console.error(err);
            });
    }

    _handleRangeSelected(toDate, fromDate) {
        let that = this;
        let range = {toDate: toDate, fromDate: fromDate};
        this.setState({range: range});
        if(this.state.selectedRace) {
            client.getCampaigns(this.state.selectedRace, range)
                .then((campaigns) => {
                    that.setState({campaigns: campaigns});
                });
        }
    }

    _handleRaceSelection(evt) {
        let race = evt.target.value
        var that = this;
        client.getCampaigns(race, this.state.range)
            .then((campaigns) => {
                that.setState({campaigns: campaigns, selectedRace: race});
            });
    }

    render() {
        const { races, campaigns} = this.state;
        const { handleCampaignSelection, selections } = this.props;

        return (
            <div>
                <LoaderComponent isLoading={this.state.loading}></LoaderComponent>
                <Row>
                    <Col md={6} xs={12}>
                      <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Select a race type</ControlLabel>
                        <FormControl ref="raceType" componentClass="select" placeholder="select" onChange={this._handleRaceSelection.bind(this)}>
                        {
                          races.map((r, idx) => {
                              return <option key={idx} value={r}>{r}</option>;
                          })
                        }
                        </FormControl>
                      </FormGroup>
                        <h3>Filter by a date range</h3>
                        <DateRangeComponent onRangeInput={this._handleRangeSelected.bind(this)}/>
                    </Col>
                    <Col xs={6}>
                        <h3>Search Results (A-Z)</h3>
                            {
			     _.sortBy(campaigns, 'name').map((c, idx) => {
                                return (
                                    <Row key={idx}>
                                        <Col xs={4}>
                                            <h5>{c.name}: </h5>
                                        </Col>
                                        <Col xs={8}>
                                            <ButtonToolbar className="well" key={idx}>
                                                {
                                                    _.sortBy(c.campaigns,'year').map((ca, idx) => {
                                                        if(selections[c.id] && _.includes(selections[c.id].campaigns, ca)) {
                                                            return (
                                                                <Button bsStyle="info" bsSize="small" key={idx} block disabled>{ca.raceTypeDetail} {ca.year}</Button>

                                                            );
                                                        }
                                                        return (
                                                            <Button bsStyle="info" onClick={() => handleCampaignSelection(c.name, c.id, ca)} bsSize="small" key={idx} block>{ca.raceTypeDetail} {ca.year}</Button>
                                                        );
                                                    })
                                                }
                                            </ButtonToolbar>
                                        </Col>
                                        <hr/>
                                    </Row>
                                );
                            })
                        }
                    </Col>
                </Row>
            </div>
        );

    }
}

export default RaceSearch;
