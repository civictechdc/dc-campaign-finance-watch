import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

const FaqComponent = () => (
    <Grid>
        <Row>
            <Col xs={12}>
                <h3>Frequently Asked Questions</h3>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <h4>Where did we get the data?</h4>
                <div>
                    All the data on this site was downloaded from the Office of Campaign Finance site.
                    All the data can be found <a href="https://efiling.ocf.dc.gov/ContributionExpenditure">here</a>.
                </div>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <h4>What did we do after downloading the data?</h4>
                <div>
                    In order to keep the data as pure as possible, no data was changed, only added.  The data we added is as follows:
                </div>
                <ul>
                    <li>Added candidate names and unique ids for both candidates and campaigns run.</li>
                    <li>While keeping the original address data, standardized and sanitized address fields for each contribution manually in order to remove typos, reporting errors and inconsistent formatting as much as possible.</li>
                    <li>Ran the contribution addresses through the Master Address Repository in order to verify addresses and collect additional information, such as ward</li>
                    <li>(Currently not in use) Ran contributor name/address combos through a deduplication process to accurately track the unique contributors</li>
                    <li>Removed "committee" contributions from the total count.  "Committee" contributions are money a campaign has already received and is being transferred to the official campaign.  For example, an exploratory committee would "contribute" the funds already collected if an official campaign is launched.</li>
                </ul>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <h4>What dates does the data include?</h4>
                <div>The data set currently available is from January 2007 through June 2015 (including the Ward 4 and Ward 8 special elections in April 2015), though we are in the process of updating it to add the current cycle's data.</div>

            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <h4>What to do if the data seems wrong?</h4>
                <div>
                    Please contact us with the data that might incorrect.  We're striving to keep the data as accurate as possible.
                    If you have a GitHub account, <a href="https://github.com/codefordc/dc-campaign-finance-watch/issues/new">click here to create an issue in our repository</a>.
                </div>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <h4>What's next?</h4>
                <div>
                    We have lots of things in the works.
                </div>
            </Col>
        </Row>
    </Grid>
);

export default FaqComponent;
