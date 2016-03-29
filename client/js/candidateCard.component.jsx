import React from 'react';
import ChartSelectorComponent from './chartSelector.jsx';
import ChartContainerComponent from './chartContainerComponent.jsx';
import _ from 'lodash';
import Client from './api';
import Promise from 'bluebird';
import {
    Panel
} from 'react-bootstrap';
import {
    ProcessContributionsOverTime,
    ProcessContributorBreakdown,
    ProcessContributionsToTree,
    ProcessContributionByWard
} from './chartDataProcessor';

const CandidateInfo = (props) => {
    const { info } = props;
    const ward = info.percentFromWard ? (<div>Percentage Raised from Ward: {(_.round(info.percentFromWard, 3)) *100}%</div>) : (false);
    return (
        <div>
            <div className="col-sm-12">
                <h4>Campaign Statistics</h4>
                <div>Total Raised: ${_.round(info.total, 2)}</div>
                <div>Average Contribution: ${_.round(info.averageContribution, 2)}</div>
                <div>Amount Contributed by Candidate: {(_.round(info.amountContributedByCandidate, 3)) * 100}%</div>
                <div>Percentage Raised in D.C.: {(_.round(info.localContributionPercentage,3)) * 100}%</div>
                <div>Contributions less than $100: {(_.round(info.smallContributionPercentage, 3)) * 100}%</div>
                <div>Percentage of Contributions for the Maxium Allowed: {(_.round(info.maximumContributionPercentage, 3)) * 100}%</div>
                <div>Individuals Contributing from a Corporate Address: {(_.round(info.individualsAtCorporateAddress,3)) * 100}%</div>
                {ward}
                <div>Ward Concentration Score: {_.round(info.wardConcentrationScore, 5)}</div>
            </div>
            <div className="col-sm-12">
                <h4>Campaign Score</h4>
                <div>Total Raised: ${_.round(info.total, 2)}</div>
                <div>Average Contribution: ${_.round(info.averageContribution, 2)}</div>
                <div>Amount Contributed by Candidate: {(_.round(info.amountContributedByCandidate, 3)) * 100}%</div>
                <div>Percentage Raised in D.C.: {(_.round(info.localContributionPercentage,3)) * 100}%</div>
                <div>Contributions less than $100: {(_.round(info.smallContributionPercentage, 3)) * 100}%</div>
                <div>Percentage of Contributions for the Maxium Allowed: {(_.round(info.maximumContributionPercentage, 3)) * 100}%</div>
                <div>Individuals Contributing from a Corporate Address: {(_.round(info.individualsAtCorporateAddress,3)) * 100}%</div>
                {ward}
                <div>Ward Concentration Score: {_.round(info.wardConcentrationScore, 5)}</div>
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

    componentWillMount() {
        const { data } = this.props;
        return Client.getCampaignData(data.campaignId)
            .then((data) => {
                return {campaignId: data.campaignId, data: data };
            })
            .then((campaign) =>{
                this.setState({chartData: campaign});
            });

    }

    componentDidMount() {
        window.addEventListener('resize', this.changeChart(this.state.activeChart));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.changeChart(this.state.activeChart));
    }

    render() {
        const {candidateName, data} = this.props;
        let chart = false;
        if(this.state.chartData) {
                let shapedData = null;
                if(this.state.activeChart) {
                    switch (this.state.activeChart) {
                        case "contributionOverTime":
                            shapedData = ProcessContributionsOverTime(this.state.chartData.data, candidateName);
                            break;
                        case "contributorBreakdown":
                            shapedData = ProcessContributorBreakdown(this.state.chartData.data, candidateName);
                            break;
                        case "contributorDendogram":
                            shapedData = ProcessContributionsToTree(this.state.chartData.data, candidateName);
                            break;
                        case "contributionByWard":
                            shapedData = ProcessContributionByWard(this.state.chartData.data, candidateName);
                        break;
                        default:
                            break;
                    }
                }
                const chartInfo = { type: this.state.activeChart, data: shapedData };
                chart = (
                    <div>
                        <ChartContainerComponent chartInfo={chartInfo} />
                    </div>
                );
        }
        return (
            <div className="candidate-card">
                <Panel>
                    <h1>{candidateName}</h1>
                    <h3>Race: {data.raceType} {data.year}</h3>
                    <CandidateInfo info={data}/>
                    <hr/>
                    <ChartSelectorComponent onChartSelected={this.changeChart}/>
                    {chart || false}
                </Panel>
            </div>
        );
    }
}
