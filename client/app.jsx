import React from 'react/addons';
import ReactDOM from 'react-dom';
import ChartContainerComponent from './js/chartContainerComponent.jsx';
import CandidateSelector from './js/candidateSelector.jsx';
import ChartSelector from './js/chartSelector.jsx';
import CreateChartComponent from './js/createChartComponent.jsx';
import CandidateCard from './js/candidateCard.component.jsx';
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
        this.state = {candidates :[]};
        this.setsetCandidatesForView = this.setCandidatesForView.bind(this);
    }

    _setChartData(chartInfo) {
        this.setState({chartInfo: chartInfo});
    }

    setCandidatesForView(candidates) {
        console.log(candidates);
        this.setState({candidates: candidates});
    }

    render () {
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
                            <CreateChartComponent setCandidates={(candidates) => this.setCandidatesForView(candidates)}></CreateChartComponent>
                        </div>
                    </div>
                    <div className="block graph">
                        {this.state.candidates.map(function(candidate, idx){
                            return (<CandidateCard key={idx} candidateName={candidate.name} data={candidate.data} />);
                        })}
                    </div>
                </main>
            </div>
        );
    }
}

ReactDOM.render(
    <AppRoot/>, document.getElementById('app'));
