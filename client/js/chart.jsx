import React from 'react/addons';
import ReactDOM from 'react-dom';
import ContributionOverTimeChart from './contributionOverTimeChart';
import ContributorBreakdownChart from './contributorBreakdownChart';

class Chart extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
        let el = ReactDOM.findDOMNode(this);
        if (this.props.chartInfo) {
            let chart = ChartFactory(this.props.chartInfo.type, el);
            this.setState({chart: chart});
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        if (nextProps.chartInfo === this.props.chartInfo) {
            return false;
        } else {
            return true;
        }
    }

    componentDidUpdate (prevProps) {
        let el = ReactDOM.findDOMNode(this);
        if (this.state.chart && (this.state.chart.type === this.props.chartInfo.type)) {
            this.state.chart.update(el, this.getChartState());
        } else {
            let chart = this.ChartFactory(this.props.chartInfo.type, el);
            this.setState({chart: chart});
        }
    }

    getChartState () {
        return {data: this.props.chartInfo.data, domain: this.props.domain};
    }

    ChartFactory (type, el) {
        switch (type) {
            case 'contributionOverTime':
                return new ContributionOverTimeChart(el, this.getChartState());
            case 'contributorBreakdown':
                return new ContributorBreakdownChart(el, this.getChartState());
        }
    }

    componentWillUpdate () {
        let el = ReactDOM.findDOMNode(this);
    }

    render () {
        return (
            <div>
                <div className="chart"></div>
            </div>
        );
    }
}

export default Chart;
