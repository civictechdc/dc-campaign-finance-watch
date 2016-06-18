import React from 'react'
import Client from '../../api'
// import ContributionsOverTimeGraph from '../../../components/ContributionOverTimeChart'

const styles = {
  width : 800,
  height: 400,
  padding: 30,
}

class ContributionsGraphContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chartData: []
    }
  }

  componentWillMount() {
    // iterating through candidates and their campaigns and appending chart
    // data to an array.
    console.log(this.props.location)
    let dataArray = []
    let candidates = this.props.location.state
    for (let candidate of candidates) {
      for (let campaign of candidate.data.campaigns) {
        Client.getCampaignData(campaign.campaignId)
          .then((data) => {
            dataArray.push(data)
            this.setState({chartData: dataArray})
          })

      }
    }
  }

  render() {

    let candidates = this.props.location.state
    let chartData = this.state.chartData
    console.log(this.state.chartData)

    return (
      <div>
      <h1> Rendering charts </h1>
      </div>
    )
  }
}

export default ContributionsGraphContainer
