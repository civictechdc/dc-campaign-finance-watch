import React from 'react';
import ChartSelectorComponent from './chartSelector.jsx';
import ChartContainerComponent from './chartContainerComponent.jsx';
import _ from 'lodash';
import Client from './api';
import Promise from 'bluebird';
import {
    Well
} from 'react-bootstrap';
import {
    ProcessContributionsOverTime,
    ProcessContributorBreakdown,
    ProcessContributionsToTree,
    ProcessContributionByWard
} from './chartDataProcessor';

const CandidateInfo = (props) => {
    const { info } = props;
    const campaigns = info.campaigns.map((camp, idx) => {
        let campaignInfo = info.candidate.campaigns.find((c) => {
            return c.campaignId === camp.campaignId;
        });
        const ward = camp.percentFromWard ? (<div>Percentage Raised from Ward: {(_.round(camp.percentFromWard, 3)) *100}%</div>) : (false);
        return (
            <div key={idx} className="col-sm-6">
                <h3>Race: {campaignInfo.raceTypeDetail}</h3>
                <h4>Campaign Statistics</h4>
                <div>Total Raised: ${_.round(camp.total, 2)}</div>
                <div>Average Contribution: ${_.round(camp.averageContribution, 2)}</div>
                <div>Amount Contributed by Candidate: {(_.round(camp.amountContributedByCandidate, 3)) * 100}%</div>
                <div>Percentage Raised in D.C.: {(_.round(camp.localContributionPercentage,3)) * 100}%</div>
                <div>Contributions less than $100: {(_.round(camp.smallContributionPercentage, 3)) * 100}%</div>
                <div>Percentage of Contributions for the Maxium Allowed: {(_.round(camp.maximumContributionPercentage, 3)) * 100}%</div>
                <div>Individuals Contributing from a Corporate Address: {(_.round(camp.individualsAtCorporateAddress,3)) * 100}%</div>
                {ward}
                <div>Ward Concentration Score: {_.round(camp.wardConcentrationScore, 5)}</div>
            </div>
        );
    });
    return (
        <div className="row">
                {campaigns}
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
        const campaignPromises = data.campaigns.map((c) =>{
            return Client.getCampaignData(c.campaignId)
                .then((data) => {
                    return {campaignId: c.campaignId, data: data };
                });
        });
        return Promise.all(campaignPromises)
            .then((campaigns) =>{
                this.setState({chartData: campaigns});
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
        let charts = false;
        if(this.state.chartData) {
            charts = this.state.chartData.map((cData) => {
                let shapedData = null;
                if(this.state.activeChart) {
                    switch (this.state.activeChart) {
                        case "contributionOverTime":
                            shapedData = ProcessContributionsOverTime(cData.data, data.candidate.name);
                            break;
                        case "contributorBreakdown":
                            shapedData = ProcessContributorBreakdown(cData.data, data.candidate.name);
                            break;
                        case "contributorDendogram":
                            shapedData = ProcessContributionsToTree(cData.data, data.candidate.name);
                            break;
                        case "contributionByWard":
                            shapedData = ProcessContributionByWard(cData.data, data.candidate.name);
                        break;
                        default:
                            break;
                    }
                }
                const chartInfo = { type: this.state.activeChart, data: shapedData };
                return (
                    <div>
                        <h4>{cData.campaignId}</h4>
                        <ChartContainerComponent chartInfo={chartInfo} />
                    </div>
                );
            });
        }
        return (
            <div className="candidate-card">
                <Well bsSize="small">
                    <h1>{candidateName}</h1>
                    <CandidateInfo info={data}/>
                    <hr/>
                    <ChartSelectorComponent onChartSelected={this.changeChart}/>
                    {charts || false}
                </Well>
            </div>
        );
    }
}
