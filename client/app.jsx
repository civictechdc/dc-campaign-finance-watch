import React from 'react/addons';
import Chart from './js/chart.jsx'
import CandidatesComponent from './js/candidates.jsx';
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
      domain: {x: [0, 30], y: [0, 100]}
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
    var selectedCandidates = this.state.selectedCandidates || [];
    selectedCandidates.push(id);
    this.setState({selectedCandidates: selectedCandidates});
  }

  _getChartData() {
    console.log(this.state.selectedCandidates);
    Client
      .getContributionChart(this.state.selectedCandidates)
      .bind(this)
      .then(function(results){
        console.log(results);
        // this.setState({data: results});
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
        <CandidatesComponent onCandidateSelection={this._handleCandidateSelection.bind(this)} candidates={candidates}/>
        <button onClick={this._getChartData.bind(this)}>Create Chart</button>
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
