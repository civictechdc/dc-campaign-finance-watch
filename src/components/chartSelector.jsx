import React from 'react';

class ChartSelectorComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <select
          ref={node => (this.input = node)}
          onChange={() => this.props.onChartSelected(this.input.value)}
        >
          <option value="">Choose information set</option>
          <option value="contributionOverTime">Contributions Over Time</option>
          <option value="contributorBreakdown">
            Breakdown of Contributions by Contributor Type
          </option>
          <option value="contributionByWard">Contributions by Ward</option>
        </select>
      </div>
    );
  }
}

export default ChartSelectorComponent;
