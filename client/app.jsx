import React from 'react/addons';
import Chart from './js/chart.jsx'
import CandidateSelector from './js/candidateSelector.jsx';
import ChartSelector from './js/chartSelector.jsx';
import {ProcessContributionsOverTime} from './js/chartDataProcessor';
import Rest from 'restler';
import Promise from 'bluebird';
import Client from './js/api';
import d3 from 'd3';

let sampleData = [
  {date: '20151001', Bowser: 2, Catania: 3},
  {date: '20151101', Bowser: 11, Catania: 15},
  {date: '20151201', Bowser: 24, Catania: 35},
];

let parseDate = d3.time.format("%Y%m%d").parse;

sampleData.forEach(function(d){
  d.date = parseDate(d.date);
});


class AppRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      domain: {x: [0, 30], y: [0, 100]},
      selectedCandidates: []
    }
  }

  componentDidMount() {

  }

  _handleCandidateSelection(id) {
    var selectedCandidates = this.state.selectedCandidates;
    selectedCandidates.push(id);
    this.setState({selectedCandidates: selectedCandidates});
  }

  _handleCandidateDeselection(id) {
    var selectedCandidates = _.remove(this.state.selectedCandidates, function(c){
      return c ===id;
    });
    this.setState({selectedCandidates: selectedCandidates});
  }

  _handleChartSelection(chart) {
    this.setState({selectedChart: chart});
  }

  _getChartData(candidates, range) {
    var dataPromise;
    var chart = this.state.selectedChart;
    switch(chart) {
      case "contributionOverTime":
        dataPromise = ProcessContributionsOverTime(candidates, range)
        break;
      case "contributorBreakdown":
        break;
      default:
        break;
    }
    dataPromise.bind(this)
      .then(function(results){
        results.forEach(function(d){
          d.date = parseDate(d.date);
        });
        this.setState({data: results});
        this.state.selectedCandidates = [];
      })
      .catch(function(err){
        console.log(err);
      });
  }

  render() {
    var candidates = this.state.candidates || [];
    return (
      <div className="mdl-layout mdl-js-layout">
        <header className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">DC Campaign Finance</span>
            <div className="mdl-layout-spacer"></div>
          </div>
        </header>
        <main className="mdl-layout__content">
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--2-col">
              <ChartSelector onChartSelected={this._handleChartSelection.bind(this)}/>
              <CandidateSelector onSelectedCandidatesSumbitted={this._getChartData.bind(this)}/>
            </div>
            <div className="mdl-cell mdl-cell--10-col">
              {(() =>{
                if(this.state.data) {
                  return (<Chart data={this.state.data}
                        chartType={this.state.selectedChart}
                        domain={this.state.domain}/>)
                }
              })()}
            </div>
          </div>
        </main>
      </div>
    )
  }
}

React.render(<AppRoot/>, document.body);
