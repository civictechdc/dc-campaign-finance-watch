import React from 'react/addons';
import {
    Button
} from 'react-bootstrap';
import Client from './api';
import ChartSelectorComponent from './chartSelector.jsx';
import DateRangeComponent from './dateRange.jsx';
import CandidatesListComponent from './candidateList.jsx';
import CandidateSearchComponent from './candidateSearchComponent.jsx';
import SelectedCandidatesComponent from './selectedCandidatesComponent.jsx';
import LoaderComponent from './loader.component.jsx';
import _ from 'lodash';

class CreateChartComponent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selectedCandidates: [],
            dataSet: null,
            beginning: null,
            end: null
        };
    }

    _handleCandidateSelected (candidate) {
        let selectedCandidates = this.state.selectedCandidates;
        selectedCandidates.unshift(candidate);
        this.setState({selectedCandidates: _.uniq(selectedCandidates)});
    }

    _handleSetSelected (set) {
        this.setState({dataSet: set});
    }

    _handleRangeSelected (end, beginning) {
        this.setState({beginning: beginning, end: end});
    }

    _clearSelectedCandidates () {
        var unselected = this
            .state
            .selectedCandidates
            .map(function (c) {
                c.selected = false;
                return c;
            });
        this.setState({candidates: unselected});
    }

    _handleRemoveSelectedCandidate(candidate) {
        let selectedCandidates = this.state.selectedCandidates;
        _.remove(selectedCandidates, function(c){
            return c.id === candidate.id;
        });
        this.setState({selectedCandidates: selectedCandidates});
    }

    _handleCreateChart () {
        this.setState({loading: true});
        var range = {
            fromDate: this.state.beginning,
            toDate: this.state.end
        };
        var candidates = this.state.selectedCandidates;
        var that = this;
        Promise.all(candidates.map(function(candidate){
            return Client
                .getCandidate(candidate, range)
                .then(function(results){
                    return {candidateName: candidate.displayName, data: results[0]};
                });
        }))
        .then(function(candidates){
            that.setState({loading: false});
            that.props.setCandidates(candidates);
            that._clearSelectedCandidates();
        })
        .catch(function (err) {
            console.log(err);
        });
    }

    render () {
        return (
            <div className="block-group">
                <LoaderComponent isLoading={this.state.loading}></LoaderComponent>
                <CandidateSearchComponent onCandidateClicked={this
                    ._handleCandidateSelected
                    .bind(this)}>
                </CandidateSearchComponent>
                <hr/>
                <SelectedCandidatesComponent selectedCandidates={this.state.selectedCandidates} onCandidateRemove={this
                    ._handleRemoveSelectedCandidate
                    .bind(this)}></SelectedCandidatesComponent>
                <DateRangeComponent onRangeInput={this
                    ._handleRangeSelected
                    .bind(this)}></DateRangeComponent>
                <hr/>
                <div className="block-group">
                    <h4 className="instructions">4. View the visualization</h4>
                    <Button onClick={this
                        ._handleCreateChart
                        .bind(this)}>Create visualization</Button>
                </div>
            </div>
        );
    }
}

export default CreateChartComponent;
