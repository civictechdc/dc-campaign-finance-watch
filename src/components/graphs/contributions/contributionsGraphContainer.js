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
      successfulFetches: 0,
      chartType: 'default',
      loading: true
    };
  }

  // asyncFetch(candidates, async) {
  //   for (let candidate of candidates) {
  //     for (let campaign of candidate.data.campaigns) {
  //       Client.getCampaignData(campaign.campaignId).then(data => {
  //         dataArray.push(data);
  //         this.setState({
  //           chartData: dataArray,
  //           successfulFetches: (successfulFetches += 1)
  //         });
  //       });
  //     }
  //   }
  // }

  componentDidMount() {
    let dataArray = [],
      candidates = this.props.location.state,
      successfulFetches = this.state.successfulFetches;

    // asyncFetch(candidates)
    for (let candidate of candidates) {
      for (let campaign of candidate.data.campaigns) {
        Client.getCampaignData(campaign.campaignId).then(data => {
          dataArray.push(data);
          this.setState({
            chartData: dataArray,
            successfulFetches: (successfulFetches += 1)
          });
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.successfulFetches === this.props.location.state.length) {
      return true;
    }
    return false;
  }

  _setSvg(svg) {
    this.setState({ svg: svg });
  }

  render() {
    let candidates = this.props.location.state

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
    } else {
      return <h1> Loading Comparison Chart </h1>;
    }
  }
}

export default ContributionsGraphContainer;
