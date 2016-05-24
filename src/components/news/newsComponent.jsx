import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

const NewsComponent = () => (
    <Grid>
        <Row>
            <Col xs={12}>
                <h3>News</h3>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <h4>Eventually this will be a headline</h4>
                <div>
                    Similarly, this will contain some text.
                </div>
            </Col>
        </Row>
    </Grid>
);

export default NewsComponent;
