import React, {Component} from 'react';
import {Panel, Button} from 'react-bootstrap';
import {CandidateInfo} from '../../../candidateCard.component.jsx';
import {LinkContainer} from 'react-router-bootstrap';

class CandidatePanel extends Component {
  constructor(props){
    super(props)
    this._loadPanelHeader = this._loadPanelHeader.bind(this);
  }
  _loadPanelHeader(campaignData, campaignID, candidateName) {

      if (campaignData[campaignID] !== undefined) {
          let candidateScore = campaignData[campaignID]['campaigns'][0]['scores']['total'].toFixed(2);
          let scoreColor = 'black';

          if (candidateScore < 40) {
              scoreColor = '#d43f3a'
          }
          else if (candidateScore >= 40 && candidateScore < 70) {
              scoreColor = '#ec971f'
          }
          else {
              scoreColor = '#5cb85c'
          }

          let color = {
              color: scoreColor
          };
          let header = (
              <div><span style={{cursor:'pointer'}}>
              {candidateName} - <span style={color}>{candidateScore}</span>
              </span></div>
          );
          return header
      } else {
          return (<div>{candidateName} - <span>retrieving score</span></div>);
      }
  }

  shouldComponentUpdate(nextProps){
    let campaignID = this.props.campaign.campaign.campaignId
    if (this.props.loading) {
      return true
    } else if (nextProps.selectedCampaign === campaignID){
      return true
    }
    return false
  }

  render() {

    const {campaignData, campaign, idx, scores, loading, loadCampaignData } = this.props
    let candidateName = campaign.candidateName.trim();
    let campaignID = campaign.campaign.campaignId;
    let header = `${candidateName}`;

    const panelStyle = {
      marginBottom: '5px'
    };

    if (scores[campaign.campaign.campaignId]) {
        let header = this._loadPanelHeader(campaignData, campaignID, candidateName);
        return (
            <Panel style={panelStyle} collapsible key={idx} eventKey={idx} header={header}>
                <CandidateInfo info={scores[campaign.campaign.campaignId]}/>
                <LinkContainer
                    to={`candidate/${campaign.candidateId}/campaign/${campaign.campaign.campaignId}`}>
                    <Button>Details</Button>
                </LinkContainer>
            </Panel>
        )

     } else if (!loading) {
        let header = this._loadPanelHeader(campaignData, campaignID, candidateName);
        return (
          <Panel  style={panelStyle} collapsible key={idx} eventKey={idx} header={header}
          onEnter={loadCampaignData}
                 >
                Loading...
            </Panel>
        )
    }
    return (
        <Panel style={panelStyle} collapsible key={idx} eventKey={idx} header={header}
        onEnter={loadCampaignData}
               >
            Loading...
        </Panel>
    )
  }
}

export default CandidatePanel
