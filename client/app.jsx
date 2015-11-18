import React from 'react/addons';
import ReactDOM from 'react-dom';
import ChartContainerComponent from './js/chartContainerComponent.jsx';
import CandidateSelector from './js/candidateSelector.jsx';
import ChartSelector from './js/chartSelector.jsx';
import CreateChartComponent from './js/createChartComponent.jsx';
import {
    ProcessContributionsOverTime,
    ProcessContributorBreakdown
} from './js/chartDataProcessor';
import Rest from 'restler';
import Promise from 'bluebird';
import Client from './js/api';
import d3 from 'd3';

class AppRoot extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            domain: {
                x: [0, 30],
                y: [0, 100]
            },
            chartInfo: {}
        };
    }

    _setChartData(chartInfo) {
        this.setState({chartInfo: chartInfo});
    }

    // _handleCandidateSelection (id) {
    //     var selectedCandidates = this.state.selectedCandidates;
    //     selectedCandidates.push(id);
    //     this.setState({selectedCandidates: selectedCandidates});
    // }

    // _handleCandidateDeselection (id) {
    //     var selectedCandidates = _.remove(this.state.selectedCandidates, function (c) {
    //         return c === id;
    //     });
    //     this.setState({selectedCandidates: selectedCandidates});
    // }

    // _handleChartSelection (chart) {
    //     this.setState({selectedChart: chart});
    // }

    // _getChartData (candidates, range) {
    //     var dataPromise;
    //     var chart = this.state.selectedChart;
    //     switch (chart) {
    //         case "contributionOverTime":
    //             dataPromise = ProcessContributionsOverTime(candidates, range);
    //             break;
    //         case "contributorBreakdown":
    //             dataPromise = ProcessContributorBreakdown(candidates, range);
    //             break;
    //         default:
    //             break;
    //     }
    //     dataPromise
    //         .bind(this)
    //         .then(function (results) {
    //             this.setState({data: results});
    //             this.state.selectedCandidates = [];
    //         })
    //         .catch(function (err) {
    //             console.log(err);
    //         });
    // }

    render () {
        var candidates = this.state.candidates || [];
        return (
            <div className="block-group">
                <header>
                    <div className="header block">
                        <span>DC Campaign Finance</span>
                    </div>
                </header>
                <main>
                    <div className="block sub-header">
                        <h2>Welcome to DC Campaign Finance</h2>
                        <h3>What information is on this site?</h3>
                        <ul>
                            <li>Where political campaign funds come from</li>
                            <li>How much money different candidates have raised over time</li>
                        </ul>
                    </div>
                    <div className="block main">
                        <div className="block-group">
                            <div className="block main-header">
                                <h5>How does it work?</h5>
                            </div>
                            <CreateChartComponent setChartData={this._setChartData.bind(this)}></CreateChartComponent>
                        </div>
                    </div>
                    <div className="block graph">
                        <ChartContainerComponent chartInfo={this.state.chartInfo} domain={this.state.domain}/>
                    </div>
                </main>
            </div>
        );
    }
}

ReactDOM.render(
    <AppRoot/>, document.getElementById('app'));
