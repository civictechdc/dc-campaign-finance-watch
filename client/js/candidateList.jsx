'use strict';

import React from 'react/addons';
import Client from './api';


class CandidatesListComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var onCandidateSelection = this.props.onCandidateSelection;
    var checks = this.props.candidates.map(function(candidate){
      return (
        <span key={candidate.id}>
          <input type="checkbox"
                  htmlId={candidate.id}
                  checked={candidate.selected}
                  onChange={onCandidateSelection.bind(this, candidate.id)}/>
                <label htmlFor={candidate.id}>{candidate.name}</label>
        </span>
      )
    });
    return (
      <form>
        <h1>All Candidates</h1>
        {checks}
      </form>
    );
  }
}

export default CandidatesListComponent;
