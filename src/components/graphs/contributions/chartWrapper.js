import React from 'react'
import ReactDOM from 'react-dom'

import GraphDefault from './graphDefault'

export default class ChartWrapper extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount () {
    console.log("componentdidmount")
      let el = ReactDOM.findDOMNode(this);
      if (this.props.chartType) {
        console.log("initiate factory call")
          let chart = this.ChartFactory(this.props.chartType, el);
          this.props.onSvgCreate(chart.svg);
      }
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log("shouldupdate")
      if (nextProps.chartInfo === this.props.chartInfo) {
          return false;
      } else {
          return true;
      }
  }

  getChartState() {
    console.log("fetching chart state")
    console.log(this.props)
    return {
      data: this.props.chartInfo
    }
  }

  ChartFactory (type, el) {
      switch (type) {
          case 'default':
              console.log("rendering default graph")
              console.log(el)
              return new GraphDefault(el, this.getChartState());
          default:
            console.log("do default")
      }
  }

  render() {
    return (
      <div>
        <div className="chart"></div>
      </div>
    )
  }
}
