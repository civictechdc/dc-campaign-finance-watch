import React from 'react'
import ReactDOM from 'react-dom'

import GraphDefault from './graphDefault'

export default class ChartWrapper extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount () {
      let el = ReactDOM.findDOMNode(this);
      if (this.props.chartType) {
          let chart = this.ChartFactory(this.props.chartType, el);
          this.props.onSvgCreate(chart.svg);
      }
  }

  shouldComponentUpdate (nextProps, nextState) {
      if (nextProps.chartInfo === this.props.chartInfo) {
          return false;
      } else {
          return true;
      }
  }

  getChartState() {
    return {
      data: this.props.chartInfo,
      candidates: this.props.candidates
    }
  }

  ChartFactory (type, el) {
      switch (type) {
          case 'default':
              return new GraphDefault(el, this.getChartState());
          default:
              return new GraphDefault(el, this.getChartState());
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
