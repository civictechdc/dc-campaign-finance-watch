import React from 'react/addons';
import DateRangeComponent from './dateRange.jsx';
import CandidatesListComponent from './candidateList.jsx';
import {Button} from 'react-bootstrap';
import Api from './api';
import _  from 'lodash';

class CandidateSelectorComponent extends React.Component {
  constructor(props) {
    super(props);
    this._rangeSelected.bind(this);
    this.state = {range: {}, candidates: []};

  }

  _rangeSelected(toDate, fromDate) {
    let that = this;
    Api
      .getCandidates(toDate, fromDate)
      .then(function(candidates){
        that.setState({candidates: candidates,
          range: {toDate: toDate, fromDate: fromDate}
        });
      });
  }

  _candidateSelected(id) {
    var candidates = this.state.candidates.map(function(candidate){
      if(candidate.id === id) {
        candidate.selected = !candidate.selected;
      }
      return candidate;
    });
    this.setState({candidates: candidates});
  }

  _submitSelectedCandidates() {
    var selectedCandidates = this.state.candidates.filter(function(c){
      return c.selected;
    });
    this.props.onSelectedCandidatesSumbitted(_.pluck(selectedCandidates, 'id'), this.state.range);
    var candidates = this.state.candidates.map(function(c){
      c.selected = false;
      return c;
    });

    this.setState({candidates: candidates});
  }

  render() {
    return (
      <div>
        <h4>2. Select a beginning and end date for the visualization, followed by which candidates should be shown. Due to resource constraints, please select a maximum of two candidates.</h4>
        <DateRangeComponent
          range={this.state.range}
          onRangeInput={(toDate, fromDate) => this._rangeSelected(toDate, fromDate)}>
        </DateRangeComponent>
        <CandidatesListComponent
          candidates={this.state.candidates}
          onCandidateSelection={(id) => this._candidateSelected(id)}></CandidatesListComponent>
      </div>
    );
  }
}

export default CandidateSelectorComponent;
