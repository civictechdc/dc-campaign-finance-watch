import React, {Component} from 'react';
import {Panel, Button} from 'react-bootstrap';
import {CandidateInfo} from '../../../candidateCard.component.jsx';
import {LinkContainer} from 'react-router-bootstrap';
import Client from '../../../api';


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
  }

  render() {

    const {campaign, idx, scores, loading, onEnterHandler } = this.props
    let candidateName = campaign.candidateName.trim();
    let campaignID = campaign.campaign.campaignId;
    let header = `${candidateName}`;

    const divStyle = {
      marginBottom: '10px',
    };
    console.log("displaying scores")
    console.log(scores)
    if (scores && scores[campaign.campaign.campaignId]) {
        // let header = this._loadPanelHeader(campaignData, campaignID, candidateName);
        console.log("load first case")
        return (
            <Panel style={divStyle} collapsible key={idx} eventKey={idx} header={header}>
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
          <Panel style={divStyle} collapsible key={idx} eventKey={idx} header={header}
          onEnter={onEnterHandler}
                 >
                Loading...
            </Panel>
        )
    }
    console.log("load third case")

    return (
        <Panel style={divStyle} collapsible key={idx} eventKey={idx} header={header}
        onEnter={onEnterHandler}
               >
            Loading...
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
