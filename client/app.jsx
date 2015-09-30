import React from 'react/addons';
import Chart from './js/chart.jsx'
import CandidateSelector from './js/candidateSelector.jsx';
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
      data: sampleData,
      domain: {x: [0, 30], y: [0, 100]},
      selectedCandidates: []
    }
  }

  componentDidMount(){
    Client
      .getCandidates()
      .bind(this)
      .then(function(response){
        this.setState({candidates: response[0]});
      })
      .catch(function(err){
        console.log(err);
      });
  }

  _handleCandidateSelection(id) {
    console.log('id selected',id);
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

  _getChartData(candidates, range) {
    console.log(candidates);
    Client
      .getContributionChart(candidates, range)
      .bind(this)
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
      <div>
        <h1>DC Campaign Finance</h1>
        <CandidateSelector onSelectedCandidatesSumbitted={this._getChartData.bind(this)}/>
        <div>
          {(() =>{
            if(this.state.data) {
              return (<Chart data={this.state.data}
                    domain={this.state.domain}/>)
            }
          })()}
        </div>

      </div>
    )
  }
}

React.render(<AppRoot/>, document.body);
