import React from 'react/addons';

class ChartSelectorComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleChange() {
    let chart = this.refs.chart.getDOMNode().value;
    this.props.onChartSelected(chart)
  }

  render() {
    return (
      <div className="mdl-cell">
        <select ref="chart" onChange={this._handleChange.bind(this)}>
          <option value="contributionOverTime">Contributions Over Time</option>
          <option value="contributorBreakdown">Contributor Breakdown</option>
          <option value="contributionsBreakdown">Contribution Breakdown</option>
        </select>
      </div>
    );
  }
}

export default ChartSelectorComponent;
