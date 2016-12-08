import React from 'react';
import ReactDOM from 'react-dom';
import ContributionOverTimeChart from './contributionOverTimeChart';
import ContributorBreakdownChart from './contributorBreakdownChart';
import ContributorDendogram from './contributorDendogramChart';
import ContributionByWardChart from './contributionByWardChart';

class Chart extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
        let el = ReactDOM.findDOMNode(this);
        if (this.props.chartInfo.type) {
            let chart = this.ChartFactory(this.props.chartInfo.type, el);
            this.props.onSvgCreate(chart.svg);
        }
    }

    shouldComponentUpdate (nextProps) {
        if (nextProps.chartInfo === this.props.chartInfo) {
            return false;
        } else {
            return true;
        }
    }

    componentDidUpdate () {
        let el = ReactDOM.findDOMNode(this);
        if (this.state.chart && (this.state.chart.type === this.props.chartInfo.type)) {
            this.state.chart.update(el, this.getChartState());
            this.props.onSvgCreate(this.state.chart.svg);
        } else {
            let chart = this.ChartFactory(this.props.chartInfo.type, el);
            this.setState({chart: chart});
            //this.props.onSvgCreate(chart.svg);
        }
    }

    getChartState () {
        return {data: this.props.chartInfo.data};
    }

    ChartFactory (type, el) {
        switch (type) {
            case 'contributionOverTime':
                return new ContributionOverTimeChart(el, this.getChartState());
            case 'contributorBreakdown':
                return new ContributorBreakdownChart(el, this.getChartState());
            case 'contributorDendogram':
                return new ContributorDendogram(el, this.getChartState());
            case 'contributionByWard':
                return new ContributionByWardChart(el, this.getChartState());
        }
    }

    componentWillUpdate () {
        ReactDOM.findDOMNode(this);
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
