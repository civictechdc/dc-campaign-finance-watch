import React from 'react/addons';
import {
    Button
} from 'react-bootstrap';
import Client from './api';
import ChartSelectorComponent from './chartSelector.jsx';
import DateRangeComponent from './dateRange.jsx';
import CandidatesListComponent from './candidateList.jsx';
import {
    ProcessContributionsOverTime,
    ProcessContributorBreakdown,
    ProcessContributionsToTree
} from './chartDataProcessor';
import CandidateSearchComponent from './candidateSearchComponent.jsx';
import SelectedCandidatesComponent from './selectedCandidatesComponent.jsx';
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
        this.setState({selectedCandidates: selectedCandidates});
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
        var dataPromise;
        var range = {
            fromDate: this.state.beginning,
            toDate: this.state.end
        };
        console.log(range);
        var chart = this.state.dataSet;
        var candidates = this.state.selectedCandidates;
        switch (chart) {
            case "contributionOverTime":
                dataPromise = ProcessContributionsOverTime(candidates, range);
                break;
            case "contributorBreakdown":
                dataPromise = ProcessContributorBreakdown(candidates, range);
                break;
            case "contributorDendogram":
                dataPromise = ProcessContributionsToTree(candidates, range);
                break;
            default:
                break;
        }
        dataPromise
            .bind(this)
            .then(function (results) {
                this.props.setChartData({data: results, type: chart});
                this._clearSelectedCandidates();
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    render () {
        return (
            <div className="block-group">
                <ChartSelectorComponent onChartSelected={this
                    ._handleSetSelected
                    .bind(this)}></ChartSelectorComponent>
                <CandidateSearchComponent onCandidateClicked={this
                    ._handleCandidateSelected
                    .bind(this)}></CandidateSearchComponent>
                <SelectedCandidatesComponent selectedCandidates={this.state.selectedCandidates} onCandidateRemove={this
                    ._handleRemoveSelectedCandidate
                    .bind(this)}></SelectedCandidatesComponent>
                <DateRangeComponent onRangeInput={this
                    ._handleRangeSelected
                    .bind(this)}></DateRangeComponent>
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
