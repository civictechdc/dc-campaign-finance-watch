'use strict';

import React from 'react/addons';
import Client from './api';


class CandidatesComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var onCandidateChange = this.props.onCandidateSelection;
    var checks = this.props.candidates.map(function(candidate){
      return (
        <span key={candidate.id}>
          <input type="checkbox"
                  htmlId={candidate.id}
                  checked={candidate.selected}
                  onChange={onCandidateChange.bind(this, candidate.id)}/>
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

export default CandidatesComponent;
