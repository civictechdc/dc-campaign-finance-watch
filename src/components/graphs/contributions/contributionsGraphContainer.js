import React from 'react'
import Client from '../../api'
// import ContributionsOverTimeGraph from '../../../components/ContributionOverTimeChart'
import ChartWrapper from './chartWrapper'

// const styles = {
//   width : 800,
//   height: 400,
//   padding: 30,
// }

class ContributionsGraphContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chartData: [],
      successfulFetches: 0,
      chartType: 'default'
    }
  }

  componentWillMount() {
    // iterating through candidates and their campaigns and appending chart
    // data to an array.
    console.log(this.props.location)
    let dataArray = []
    let candidates = this.props.location.state
    let successfulFetches = this.state.successfulFetches
    for (let candidate of candidates) {
      for (let campaign of candidate.data.campaigns) {
        Client.getCampaignData(campaign.campaignId)
          .then((data) => {
            dataArray.push(data)
            console.log("incrementing fetch")
            console.log(dataArray)
            this.setState({
              chartData: dataArray,
              successfulFetches: successfulFetches+=1})
          })

      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.successfulFetches == (this.props.location.state).length) {
      return true
    }
    return false
  }

  _setSvg (svg) {
      this.setState({'svg': svg});
  }

  render() {

    let chartType = this.state.chartType
    let candidates = this.props.location.state
    let chartData = this.state.chartData

    console.log(chartData)
    // check for data integrity
    if (chartData.length == candidates.length) {
      return (
        <div>
        <h1> Rendering comparison chart </h1>
        <ChartWrapper
        chartInfo = {chartData}
        chartType={chartType}
        onSvgCreate = {this._setSvg.bind(this)}/>

        </div>
      )
    } else {
      return (
        <h1> Loading Comparison Chart </h1>
      )
    }
  }
}

export default ContributionsGraphContainer
