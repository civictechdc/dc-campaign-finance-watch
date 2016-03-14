'use strict';

import React from 'react';
import {
    Input
} from 'react-bootstrap';
import Client from './api';

class CandidatesListComponent extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        var onCandidateSelected = this.props.onCandidateSelected;
        var checks = this
            .props
            .availableCandidates
            .map(function (candidate) {
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
