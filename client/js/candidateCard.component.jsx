import React from 'react/addons';
import ChartSelectorComponent from './chartSelector.jsx';
import ChartContainerComponent from './chartContainerComponent.jsx';
import {
    ProcessContributionsOverTime,
    ProcessContributorBreakdown,
    ProcessContributionsToTree
} from './chartDataProcessor';


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
            <div>
                <h1>{candidateName}</h1>
                <ChartSelectorComponent onChartSelected={this.changeChart}/>
                <ChartContainerComponent chartInfo={chartInfo} />
            </div>
        );
    }
}
