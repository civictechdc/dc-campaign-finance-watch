import React from 'react';
import Client from '../api';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import CampaignInfo from './campaignInfo';
import CampaignTable from './campaignTable.jsx';
import Promise from 'bluebird';
import CampaignTabs from '../tabs/campaignTabs'

class CampaignDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { contributions: [], activeTab: 'visualizer' };
  }

  componentWillMount() {
    const { id, candidateId } = this.props.match.params;

    let that = this;
    const detailsPromise = Client.getCampaignData(id);
    const scorePromise = Client.getCandidate({
      id: candidateId,
      campaigns: [{ campaignId: id }]
    });
    Promise.join(detailsPromise, scorePromise, function(details, score) {
      that.setState({
        contributions: details,
        campaignScore: score.campaigns[0],
        candidate: score.candidate
      });
    });
  }

  render() {
    const { contributions, campaignScore, candidate } = this.state;

    const { id } = this.props.match.params;

    if (contributions && campaignScore) {
      return (
        <Row>
          <Col xs={12}>
            <Row>
              <Col xs={12}>
                <h2>{candidate.name}</h2>
              </Col>
            </Row>
          </Col>
          <Col xs={3}>
            <CampaignInfo info={campaignScore} />
          </Col>
          <Col xs={9}>
            <CampaignTabs
              id = {id}
            >
              <CampaignTable contributions={contributions} />
            </CampaignTabs>
          </Col>
        </Row>
      );
    }
    return <h3>Loading...</h3>;
  }
}

export default CampaignDetailComponent;
