import React from 'react';
import { Button } from 'react-bootstrap';
import Client from './api';
import DateRangeComponent from './dateRange.jsx';
import CandidateSearchComponent from './candidateSearchComponent.jsx';
import SelectedCandidatesComponent from './selectedCandidatesComponent.jsx';
import LoaderComponent from './loader.component.jsx';
import _ from 'lodash';

class CreateChartComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCandidates: [],
      dataSet: null,
      beginning: null,
      end: null
    };
  }

  _handleCandidateSelected(candidate) {
    let selectedCandidates = this.state.selectedCandidates;
    selectedCandidates.unshift(candidate);
    this.setState({ selectedCandidates: _.uniq(selectedCandidates) });
  }

  _handleSetSelected(set) {
    this.setState({ dataSet: set });
  }

  _handleRangeSelected(end, beginning) {
    this.setState({ beginning: beginning, end: end });
  }

  _clearSelectedCandidates() {
    var unselected = this.state.selectedCandidates.map(function(c) {
      c.selected = false;
      return c;
    });
    this.setState({ candidates: unselected });
  }

  _handleRemoveSelectedCandidate(candidate) {
    let selectedCandidates = this.state.selectedCandidates;
    _.remove(selectedCandidates, function(c) {
      return c.id === candidate.id;
    });
    this.setState({ selectedCandidates: selectedCandidates });
  }

  _handleCreateChart() {
    this.setState({ loading: true });
    var range = {
      fromDate: this.state.beginning,
      toDate: this.state.end
    };
    var candidates = this.state.selectedCandidates;
    var that = this;
    Promise.all(
      candidates.map(function(candidate) {
        return Client.getCandidate(candidate, range).then(function(results) {
          return {
            candidateName: candidate.name,
            profilePictureUrl: candidate.profilePictureUrl,
            data: results[0]
          };
        });
      })
    )
      .then(function(candidates) {
        that.setState({ loading: false });
        that.props.setCandidates(candidates);
        that._clearSelectedCandidates();
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="block-group">
        <LoaderComponent isLoading={this.state.loading} />
        <CandidateSearchComponent
          onCandidateClicked={this._handleCandidateSelected.bind(this)}
        />
        <SelectedCandidatesComponent
          selectedCandidates={this.state.selectedCandidates}
          onCandidateRemove={this._handleRemoveSelectedCandidate.bind(this)}
        />
        <DateRangeComponent
          onRangeInput={this._handleRangeSelected.bind(this)}
        />
        <hr />
        <div className="create-visualization">
          <h4 className="instructions">3. View the visualization</h4>
          <h5>
            {' '}
            Complete the above steps to enable the create visualization button.
          </h5>
          <Button
            disabled={
              this.state.loading ||
                this.state.selectedCandidates.length === 0 ||
                this.state.beginning === null ||
                this.state.end === null
            }
            onClick={this._handleCreateChart.bind(this)}
          >
            Create visualization
          </Button>
        </div>
        <hr />
      </div>
    );
  }
}

export default CreateChartComponent;
