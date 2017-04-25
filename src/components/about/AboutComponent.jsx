import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

const AboutComponent = () => (
  <Grid className="about">
    <Row>
      <Col xs={12}>
        <h3>About This Project</h3>
        <div>
          The purpose of this project is to attempt to shine some light on campaign contributions in local
          D.C. elections.  We hope to provide unbiased views into the data set that others can use to back
          their own stories.  Hopefully, with insight from this data we can all work together to make elections
          in the District more transparent.
        </div>
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <h3>What is Code for DC?</h3>
        <div>
          Code for DC is a Code for America Brigade located here in Washington, D.C. Founded in 2012, we are a a non-partisan, non-political group of volunteer civic hackers working together to solve local issues and help people engage with the city.
          We host twice-monthly hacknights and other events to gather, discuss, and get stuff done.
        </div>
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <h3>Who are we?</h3>
        <Row>
          <Col xs={3}>Michael Kalish</Col>
          <Col xs={9}>
            I'm a lifelong DMV resident who has been involved in this project since 2014.
            I'm passionate about making technology more accessible and using open source
            technologies to impart change.  Contact me at kalishmichael@gmail.com or mkalish on github.
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={3}>Jeremy Koulish (no relation to Michael)</Col>
          <Col xs={9}>
            I moved to DC in 2007 for a career in politics, and came to love this strange, beautiful city despite the politics.
            A professional policy wonk and strategist turned web developer, I've long been passionate about using open data to enhance civic education and participation.
            My work on this project emerged from initial work toward a similar tool as part of my side project,
            {' '}
            <a href="http://dcfuture.com">DCFuture</a>
            .
          </Col>
        </Row>
      </Col>
    </Row>
  </Grid>
);

export default AboutComponent;
