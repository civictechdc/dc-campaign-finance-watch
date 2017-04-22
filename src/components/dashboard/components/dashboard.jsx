import React, {Component} from 'react'
import YearFilter from './yearFilter/yearFilter.jsx'
import RaceContainer from './race/raceContainer.jsx'
import {Col, Row} from 'react-bootstrap';

class Dashboard extends Component {
  render() {
      const { races, scores, campaignData, loading, changeYears } = this.props;
      return (
          <Row>
              <Col xs={12}>
                  <h2>DC Campaign Finance Watch</h2>
                  <Row>
                      <Col xs={12}>
                          <YearFilter changeYears={changeYears}/>
                      </Col>
                  </Row>
                  <Row>
                      <RaceContainer
                      races={races}
                      scores={scores}
                      loading={loading}
                      campaignData={campaignData}
                      />
                  </Row>

              </Col>
          </Row>
      );
  }
}

export default Dashboard;
