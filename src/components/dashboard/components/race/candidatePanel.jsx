import React, {Component} from 'react';
import {Panel} from 'react-bootstrap';
import {CandidateInfo} from '../../../candidateCard.component.jsx';
import {LinkContainer} from 'react-router-bootstrap';


function _loadPanelHeader(campaignData, campaignID, candidateName) {
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

        let style = {
            color: scoreColor
        };
        let header = (
            <div>{candidateName} - <span style={style}>{candidateScore}</span></div>
        );
        return header
    } else {
        return (<div>{candidateName} - <span>retrieving score</span></div>);
    }
}


// function CandidatePanel({campaign, idx, scores, loading, onEnterHandler}) {
class CandidatePanel extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        scores: {}
    }
    this._loadCampaignData = this._loadCampaignData.bind(this);

  }
  _loadCampaignData(candidateId, campaignId) {
    console.log('loading campaign adata')
      Client.getCandidate({
          id: candidateId,
          campaigns: [{campaignId: campaignId}]
      })
      .then((data) => {
          const {scores} = this.props;
          scores[campaignId] = data.campaigns[0];
          this.setState({scores: scores});
      });
  }

  render() {

    const {campaign, idx, scores, loading } = this.props
    let candidateName = campaign.candidateName.trim();
    let campaignID = campaign.campaign.campaignId;
    let header = `${candidateName}`;
    // let scores = this.props.scores
    console.log(scores)
    if (scores && scores[campaign.campaign.campaignId]) {
        // let header = this._loadPanelHeader(campaignData, campaignID, candidateName);
        console.log("load first case")
        return (
            <Panel key={idx} eventKey={idx} header={header}>
                <CandidateInfo info={scores[campaign.campaign.campaignId]}/>
                <LinkContainer
                    to={`candidate/${campaign.candidateId}/campaign/${campaign.campaign.campaignId}`}>
                    <Button>Details</Button>
                </LinkContainer>
            </Panel>
        )

     } else if (!loading) {
       console.log("load second case")

        // let header = this._loadPanelHeader(campaignData, campaignID, candidateName);

        return (
          <Panel key={idx} eventKey={idx} header={header}
          onEnter={() => {

              this._loadCampaignData(campaign.candidateId, campaign.campaign.campaignId)
          }}
                 >
                Loading...
            </Panel>
        )
    }
    console.log("load third case")

    return (
        <Panel key={idx} eventKey={idx} header={header}
        onEnter={() => {
            this._loadCampaignData(campaign.candidateId, campaign.campaign.campaignId)
        }}
               >
            Loading...here
        </Panel>
    )
  }

}

// }

export default CandidatePanel


// let candidateName = campaign.candidateName.trim();
// let campaignID = campaign.campaign.campaignId;
// let header = `${candidateName}`;
// if (scores && scores[campaign.campaign.campaignId]) {
//     let header = this._loadPanelHeader(campaignData, campaignID, candidateName);
//
//     return (
//         <Panel key={idx} eventKey={idx} header={header}>
//             <CandidateInfo info={scores[campaign.campaign.campaignId]}/>
//             <LinkContainer
//                 to={`candidate/${campaign.candidateId}/campaign/${campaign.campaign.campaignId}`}>
//                 <Button>Details</Button>
//             </LinkContainer>
//         </Panel>
//     )
//
//  } else if (!loading) {
//     let header = this._loadPanelHeader(campaignData, campaignID, candidateName);
//
//     return (
//         <Panel key={idx} eventKey={idx} header={header}
//                onEnter={() => {
//                    this._loadCampaignData(campaign.candidateId, campaign.campaign.campaignId)
//                }
//                }>
//             Loading...
//         </Panel>
//     )
// }
// return (
//     <Panel key={idx} eventKey={idx} header={header}
//            onEnter={() => {
//                this._loadCampaignData(campaign.candidateId, campaign.campaign.campaignId)
//            }
//            }>
//         Loading...
//     </Panel>
// )
