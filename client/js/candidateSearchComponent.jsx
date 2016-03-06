import React from 'react/addons';
import Rx from 'rx';
import {
    FuncSubject
} from 'rx-react';
import Client from './api';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

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
                return Client.search(value);
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
        let _handleAvailableCandidateClicked = this._handleAvailableCandidateClicked;
        let self = this;
        let candidates = this.state.availableCandidates.map(function(c, index){
            return (
                <ListGroupItem
                    key={'available' + index}
                    onClick={_handleAvailableCandidateClicked.bind(self, c)}
                    className="candidate-search-item"
                >
                    {c.name}
                </ListGroupItem>
            );
        });
        return (
            <div className="candidate-search">
                <h4 className="instructions">2. Search for candidates to visualize</h4>
                <input onInput={this.inputValue} placeholder="Search for a candidate"/>
                <ListGroup>
                    {candidates}
                </ListGroup>
            </div>
        );
    }
}

export default CandidateSearchComponent;
