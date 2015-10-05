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
          <label key={candidate.id} htmlFor={candidate.id} className="mdl-checkbox">
            <input type="checkbox"
                    className="mdl-checkbox__input"
                    id={candidate.id}
                    htmlId={candidate.id}
                    checked={candidate.selected}
                    onChange={onCandidateSelection.bind(this, candidate.id)}/>
            <span className="mdl-checkbox__label">{candidate.name}</span>
          </label>
      );
    });
    return (
      <div className="candidate-list">
        <form>
          {checks}
        </form>
      </div>
    );
  }
}

export default CandidatesListComponent;
