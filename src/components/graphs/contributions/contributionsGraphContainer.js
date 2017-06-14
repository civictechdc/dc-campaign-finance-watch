import React from 'react';
import Client from '../../api';
import ChartWrapper from './chartWrapper';
import { flatten } from 'lodash';
import CampaignTabs from '../../tabs/campaignTabs'

class ContributionsGraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      chartType: 'default',
      loading: true
    };
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async componentWillMount() {
    let dataArray = [],
      candidates = this.props.location.state,
      successfulFetches = this.state.successfulFetches;

    for (let candidate of candidates) {
      for (let campaign of candidate.data.campaigns) {
        dataArray.push(await Client.getCampaignData(campaign.campaignId))
      }
    }
    await this.setStateAsync({
      chartData: dataArray,
      loading: false
    })

  }

  _setSvg(svg) {
    this.setState({ svg: svg });
  }

  render() {
    let candidates = this.props.location.state
    let loading = this.state.loading

    let candidateCampaigns = candidates.map(candidate => {
      for (let campaign of candidate.data.campaigns) {
        return <p> {candidate.candidateName} - {campaign.raceType} </p>;
      }
    });
    const ids = flatten([
      ...candidates.map(can => {
        return can.data.campaigns.map(campaign => campaign.campaignId);
      })
    ]).join(':');

    const { chartData, chartType } = this.state;

    if (loading) {
      return <h1> Loading Comparison Chart </h1>
    }
    // check for data integrity
    if (chartData.length === candidates.length) {
      return (
        <CampaignTabs id = {ids}>
          <div>
            <h1> Contribution Comparison Chart </h1>
            <h3> Selected Campaigns </h3>
            {candidateCampaigns}
            <ChartWrapper
              chartInfo={chartData}
              chartType={chartType}
              onSvgCreate={this._setSvg.bind(this)}
              candidates={candidates}
            />
          </div>
        </CampaignTabs>
      )
    }
  }
}

export default ContributionsGraphContainer;
