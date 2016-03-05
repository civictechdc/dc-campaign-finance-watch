import React from 'react/addons';
import ChartSelectorComponent from './chartSelector.jsx';
import ChartContainerComponent from './chartContainerComponent.jsx';
import {
    Well
} from 'react-bootstrap';
import {
    ProcessContributionsOverTime,
    ProcessContributorBreakdown,
    ProcessContributionsToTree
} from './chartDataProcessor';

const CandidateInfo = () => {
    return (
        <div className="row">
            <div className="col-xs-6">
                <h4>Contribution Breakdown</h4>
                <ul>
                    <li>65% from within DC: -10</li>
                    <li>85% of contributions were for the maximum: -5</li>
                </ul>
            </div>
            <div className="col-xs-6">
                <h4>Transparency</h4>
                <ul>
                    <li>85% of records completed to the legal limit: -5</li>
                    <li>15% fo recrods were complte: -5</li>
                </ul>
            </div>
        </div>
    );
};


export default class CandidateCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeChart = this.changeChart.bind(this);
    }

    changeChart(chart) {
        this.setState({activeChart: chart});
    }

    render() {
        const {candidateName, data} = this.props;
        let shapedData = null;
        if(this.state.activeChart) {
            switch (this.state.activeChart) {
                case "contributionOverTime":
                    shapedData = ProcessContributionsOverTime(data);
                    break;
                case "contributorBreakdown":
                    shapedData = ProcessContributorBreakdown(data);
                    break;
                case "contributorDendogram":
                    shapedData = ProcessContributionsToTree(data);
                    break;
                default:
                    break;
            }
        }
        let chartInfo = {type: this.state.activeChart, data: shapedData};
        console.log(chartInfo);
        return (
            <div className="candidate-card">
                <Well bsSize="small">
                    <h1>{candidateName}</h1>
                    <CandidateInfo/>
                    <hr/>
                    <ChartSelectorComponent onChartSelected={this.changeChart}/>
                    <ChartContainerComponent chartInfo={chartInfo} />
                </Well>
            </div>
        );
    }
}
