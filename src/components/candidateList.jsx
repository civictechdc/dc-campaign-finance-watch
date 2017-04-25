'use strict';

import React from 'react';
import { Input } from 'react-bootstrap';

class CandidatesListComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let onCandidateSelected = this.props.onCandidateSelected;
    let checks = this.props.availableCandidates.map(function(candidate) {
      return (
        <Input
          type="checkbox"
          label={candidate.name}
          key={candidate.id}
          checked={candidate.selected}
          onChange={onCandidateSelected.bind(this, candidate)}
        />
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
