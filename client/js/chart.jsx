import React from 'react/addons';
import ContributionOverTimeChart from './contributionOverTimeChart';
import ContributorBreakdownChart from './contributorBreakdownChart';

class Chart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};
  }

  componentDidMount() {
    let el = React.findDOMNode(this);
    if(this.props.data && this.props.chartType) {
      let chart = ChartFactory(this.props.chartType, el);
      this.setState({chart: chart});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.data === this.props.data) {
      return false;
    } else {
      return true;
    }
  }

  componentDidUpdate(prevProps) {
    let el = React.findDOMNode(this);
    if(this.state.chart && (this.state.chart.type === this.props.chartType)) {
      this.state.chart.update(el, this.getChartState());
    } else {
        let chart = this.ChartFactory(this.props.chartType, el);
        this.setState({chart: chart});
    }
  }

  getChartState() {
    return {
      data: this.props.data,
      domain: this.props.domain
    }
  }

  ChartFactory(type, el) {
    switch(type) {
      case 'contributionOverTime':
        return new ContributionOverTimeChart(el, this.getChartState());
      case 'contributorBreakdown':
        return new ContributorBreakdownChart(el, this.getChartState());
    }
  }

  componentWillUpdate(){
    let el = React.findDOMNode(this);
  }

  render() {
    return (
      <div>
        <div className="chart"></div>
      </div>
    );
  }
}

export default Chart;
