import React from 'react/addons';
import d3Chart from './d3Chart';

var chart;

class Chart extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let el = React.findDOMNode(this);
    chart = new d3Chart(el, {
      width: '100%',
      height: '300px'
    }, this.getChartState())
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.data === this.props.data) {
      return false;
    } else {
      return true;
    }
  }

  componentDidUpdate() {
    let el = React.findDOMNode(this);
    chart.update(el, this.getChartState());
  }

  getChartState() {
    return {
      data: this.props.data,
      domain: this.props.domain
    }
  }

  componentWillUpdate(){
    let el = React.findDOMNode(this);
    chart.destroy(el);
  }

  render() {
    return (
      <div className="chart"></div>
    );
  }
}

export default Chart;
