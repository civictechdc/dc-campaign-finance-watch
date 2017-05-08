/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import React, {Component} from 'react';
import _ from 'lodash';
import Client from '../api';
import LoaderComponent from '../loader.component.jsx';
import DataComponent from './dataComponent'

class DataContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { candidates: [] };
  }

  componentWillMount() {
    const candidates = this.props.location.state;
    this.setState({ loading: true });
    var that = this;
    Promise.all(
      _.map(candidates, function(candidate) {
        return Client.getCandidate(candidate).then(function(results) {
          return {
            candidateName: candidate.name,
            data: results,
            id: candidate.id
          };
        });
      })
    )
      .then(function(candidates) {
        that.setState({ candidates: candidates, loading: false });
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  render() {
    const { candidates, loading } = this.state;
    //define route to compare contribution graphs with candidate data
    const contributionsGraph = {
      pathname: 'contribution_graph',
      state: candidates
    };
    if (loading || !candidates) {
      return <LoaderComponent isLoading={loading} />;
    }

    return (
      <DataComponent
        contributionsGraph = {contributionsGraph}
        candidates = {candidates}
        />
    )
  }
}

export default DataContainer;
