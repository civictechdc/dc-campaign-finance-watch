import React from 'react/addons';
import {
    Button,
    Glyphicon
} from 'react-bootstrap';

class SelectedCandidatesComponent extends React.Component {
    constructor (props) {
        super(props);
    }

    _handleRemoveCandidateClicked(candidate) {
        this.props.onCandidateRemove(candidate);
    }

    render () {
        let removeCandidate = this._handleRemoveCandidateClicked;
        let self = this;
        if (this.props.selectedCandidates) {
            let candidates = this.props.selectedCandidates.map(function (c, index) {
                return (
                    <div key={'selected_' + index}>
                        <span>{c.name}</span>
                        <Button onClick={removeCandidate.bind(self, c)}>
                            <Glyphicon glyph="remove"></Glyphicon>
                        </Button>
                    </div>
                );
            });
            return (
                <div className="selected-candidates">
                    {candidates}
                </div>
            );
        }
    }
}

export default SelectedCandidatesComponent;
