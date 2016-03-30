import React from 'react';
import client from '../api';
import { Input, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import DateRangeComponent from '../dateRange.jsx';
import LoaderComponent from '../loader.component.jsx';

class RaceSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {races: [], campaigns: []};
    }

    componentWillMount() {
        var that = this;
        client.getRaces()
            .then(function(races){
                races = races[0];
                races.unshift('Select a race type');
                that.setState({races: races});
            });
    }

    componentWillUpdate(nextProps, nextState) {
        let { range } = nextState;
    }

    _handleRangeSelected(toDate, fromDate) {
        let that = this;
        let range = {toDate: toDate, fromDate: fromDate};
        this.setState({range: range});
        if(this.state.selectedRace) {
            client.getCampaigns(this.state.selectedRace, range)
                .then((campaigns) => {
                    that.setState({campaigns: campaigns[0]});
                });
        }
    }

    _handleRaceSelection() {
        let race = this.refs.raceType.getValue();
        var that = this;
        client.getCampaigns(race, this.state.range)
            .then((campaigns) => {
                that.setState({campaigns: campaigns[0], selectedRace: race});
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
                        <Input ref="raceType" type="select" label="Select a race type" onChange={this._handleRaceSelection.bind(this)}>
                            {
                                races.map((r, idx) => {
                                    return <option key={idx} value={r}>{r}</option>;
                                })
                            }
                        </Input>
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
