import React from 'react';
import Client from '../../api';
import ChartWrapper from './chartWrapper';
import { flatten } from 'lodash';
import { Tabs, Tab } from 'react-bootstrap';

class ContributionsGraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      successfulFetches: 0,
      chartType: 'default',
      activeTab: 'visualizer'
    };
    this.setActiveTab = this.setActiveTab.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
    this.goFullScreen = this.goFullScreen.bind(this);
  }

  componentWillMount() {
    let dataArray = [],
      candidates = this.props.location.state,
      successfulFetches = this.state.successfulFetches;

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

  setActiveTab(tab) {
    this.setState({ activeTab: tab });
  }

  goFullScreen(tab) {
    this.setState({ fullScreenTab: tab });
  }

  renderTabs(candidateCampaigns) {
    const fullScreenStyle = {
      top: 0,
      bottom: 0,
      position: 'fixed',
      left: 0,
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      zIndex: 99999
    };

    const { activeTab, fullScreenTab, chartData, chartType } = this.state;
    const candidates = this.props.location.state;
    const ids = flatten([
      ...candidates.map(can => {
        return can.data.campaigns.map(campaign => campaign.campaignId);
      })
    ]).join(':');
    const vizTitle = (
      <span>
        Visualizations
        {' '}
        <button
          style={{ padding: '0', paddingLeft: '2px', paddingRight: '2px' }}
          onClick={() => this.goFullScreen('visualizer')}
          disabled={activeTab !== 'visualizer'}
          className="btn btn-info btn-xs"
        >
          <i className="fa fa-expand" />
        </button>
      </span>
    );
    const tableTitle = <span>Contribution Table</span>;

    if (fullScreenTab === 'visualizer') {
      return (
        <Tabs>
          <Tab
            id="keshif"
            eventKey={1}
            title={vizTitle}
            onEntered={() => this.setActiveTab('visualizer')}
          >
            <div className="campaign-visualizer">
              <iframe
                style={fullScreenStyle}
                src={
                  'https://codefordc.org/campaign-finance-explorer/index.html?' +
                    ids
                }
              />
              <button
                className="btn btn-info btn-xs"
                onClick={() => this.goFullScreen('')}
                style={{
                  padding: '0',
                  paddingLeft: '2px',
                  paddingRight: '2px',
                  position: 'fixed',
                  top: '2px',
                  right: '10px',
                  zIndex: 999999
                }}
              >
                <i className="fa fa-compress" />
              </button>
            </div>
          </Tab>
          <Tab
            id="table"
            eventKey={2}
            title={tableTitle}
            onEntered={() => this.setActiveTab('table')}
          >
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
          </Tab>
        </Tabs>
      );
    }

    return (
      <Tabs>
        <Tab
          id="keshif"
          eventKey={1}
          title={vizTitle}
          onEntered={() => this.setActiveTab('visualizer')}
        >
          <div className="campaign-visualizer">
            <iframe
              style={fullScreenTab === 'visualizer' ? fullScreenStyle : {}}
              src={
                'https://codefordc.org/campaign-finance-explorer/index.html?' +
                  ids
              }
            />
          </div>
        </Tab>
        <Tab
          id="table"
          eventKey={2}
          title={tableTitle}
          onEntered={() => this.setActiveTab('table')}
        >
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
        </Tab>
      </Tabs>
    );
  }

  render() {
    let candidates = this.props.location.state,
      chartData = this.state.chartData;

    let candidateCampaigns = candidates.map(candidate => {
      for (let campaign of candidate.data.campaigns) {
        return <p> {candidate.candidateName} - {campaign.raceType} </p>;
      }
    });
    // check for data integrity
    if (chartData.length === candidates.length) {
      return this.renderTabs(candidateCampaigns);
    } else {
      return <h1> Loading Comparison Chart </h1>;
    }
  }
}

export default ContributionsGraphContainer;
