import React from 'react';
import ReactDOM from 'react-dom';
import {Input} from 'react-bootstrap';

class ChartSelectorComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <select ref={node => this.input = node} onChange={() => this.props.onChartSelected(this.input.value)}>
          <option value="">Choose information set</option>
          <option value="contributionOverTime">Contributions Over Time</option>
          <option value="contributorBreakdown">Breakdown of Contributions</option>
          <option value="contributorDendogram">Tree of Contributors</option>
        </select>
      </div>
    );
  }
}

export default ChartSelectorComponent;
