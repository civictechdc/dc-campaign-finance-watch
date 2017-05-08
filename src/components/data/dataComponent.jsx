/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import React, {Component} from 'react';
import _ from 'lodash';
import CandidateCard from '../candidateCard.component.jsx';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class DataComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { candidates, contributionsGraph } = this.props;
    //define route to compare contribution graphs with candidate data
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
