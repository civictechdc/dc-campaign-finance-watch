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
    ProcessContributorBreakdown
} from './chartDataProcessor';

class CreateChartComponent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            candidates: [],
            dataSet: null,
            beginning: null,
            end: null
        };
    }

    _handleCandidateSelected (candidate) {
        candidate.selected = !candidate.selected;
        console.log('candidate ', candidate);
    }

    _handleSetSelected (set) {
        this.setState({dataSet: set});
    }

    _handleRangeSelected (end, beginning) {
        var self = this;
        Client
            .getCandidates(end, beginning)
            .then(function (candidates) {
                self.setState({candidates: candidates, beginning: beginning, end: end});
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    _clearSelectedCandidates () {
        var unselected = this
            .state
            .candidates
            .map(function (c) {
                c.selected = false;
                return c;
            });
        this.setState({candidates: unselected});
    }

    _handleCreateChart () {
        var dataPromise;
        var range = {
            fromDate: this.state.beginning,
            toDate: this.state.end
        };
        var chart = this.state.dataSet;
        var candidates = this
            .state
            .candidates
            .filter(function (c) {
                return c.selected;
            });
        switch (chart) {
            case "contributionOverTime":
                dataPromise = ProcessContributionsOverTime(candidates, range);
                break;
            case "contributorBreakdown":
                dataPromise = ProcessContributorBreakdown(candidates, range);
                break;
            default:
                break;
        }
        dataPromise
            .bind(this)
            .then(function (results) {
                this.props.setChartData({data:results, type: chart});
                this._clearSelectedCandidates();
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    render () {
        return (
            <div>
                <ChartSelectorComponent onChartSelected={this
                    ._handleSetSelected
                    .bind(this)}></ChartSelectorComponent>
                <DateRangeComponent onRangeInput={this
                    ._handleRangeSelected
                    .bind(this)}></DateRangeComponent>
                <CandidatesListComponent availableCandidates={this.state.candidates} onCandidateSelected={this
                    ._handleCandidateSelected
                    .bind(this)}></CandidatesListComponent>
                <Button onClick={this
                    ._handleCreateChart
                    .bind(this)}>Create visualization</Button>
            </div>
        );
    }
}

export default CreateChartComponent;
