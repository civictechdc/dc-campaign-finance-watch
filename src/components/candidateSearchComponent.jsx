import React from 'react';
import {
    FuncSubject
} from 'rx-react';
import Client from './api';
import {ButtonToolbar, Button, Row, Col} from 'react-bootstrap';
import _ from 'lodash';
import Promise from 'bluebird';

class CandidateSearchComponent extends React.Component {
    constructor (props) {
        super(props);
        this
            .componentWillMount
            .bind(this);
        this.state = {
            availableCandidates: []
        };
    }

    componentWillMount () {
        var self = this;
        this.inputValue = FuncSubject.create(function (event) {
            return event.target.value;
        });

        this
            .inputValue
            .debounce(500)
            .distinctUntilChanged()
            .flatMapLatest(function (value) {
                if(value) {
                    return Client.search(value);
                }
                return Promise.resolve([]);
            })
            .subscribe(function (data) {
                self.setState({availableCandidates: data});
            }, function (errorr) {
                console.log(error);
            });
    }

    _handleAvailableCandidateClicked(candidate) {
        this.props.onCandidateClicked(candidate);
    }

    render () {
        const { handleCampaignSelection } = this.props;
        const { availableCandidates } = this.state;
        return (
            <div>
                <Row>
                    <Col xs={3}>
                        <h5>Search by candidate name</h5>
                        <input onInput={this.inputValue} placeholder="Search for a candidate"/>
                    </Col>
                    <Col xs={9}>
                        <h3>Search Results (A-Z)</h3>
                        {
                            _.sortBy(availableCandidates,'name').map((c, idx) => {
                                return (
                                    <Row key={idx}>
                                        <Col xs={4}>
                                            <h5>{c.name}: </h5>
                                        </Col>
                                        <Col xs={8}>
                                            <ButtonToolbar className="well" key={idx}>
                                                {
                                                    _.sortBy(c.campaigns,'year').map((ca, idx) => {
                                                        return (
                                                            <Button onClick={() => handleCampaignSelection(c.name, c.id, ca)} bsSize="small" bsStyle="info" key={idx} block>{ca.raceTypeDetail} {ca.year}</Button>
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

export default CandidateSearchComponent;
