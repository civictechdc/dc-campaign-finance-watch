/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import React from 'react';
import _ from 'lodash';
import Client from '../api';
import CandidateCard from '../candidateCard.component.jsx';
import LoaderComponent from '../loader.component.jsx';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';

class DataComponent extends React.Component {
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
      <Grid>
        <Row>
          <h4>Data Set</h4>
        </Row>
        <Row>
          <Link to={contributionsGraph}>
            <Button bsStyle="primary" bsSize="large">
              Compare candidate contributions
            </Button>
          </Link>
        </Row>
        <Row>
          {_.map(candidates, function(candidate, idx) {
            return candidate.data.campaigns.map((campaign, idx) => {
              return (
                <Col xs={12} md={6} key={idx}>
                  <CandidateCard
                    candidateName={candidate.candidateName}
                    candidateId={candidate.id}
                    candidateProfilePictureUrl={
                      candidate.data.candidate.profilePictureUrl
                    }
                    data={campaign}
                  />
                </Col>
              );
            });
          })}
        </Row>
      </Grid>
    );
  }
}

export default DataComponent;
