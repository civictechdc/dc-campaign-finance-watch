import React from 'react/addons';
import ReactDOM from 'react-dom';
import {Input} from 'react-bootstrap';

class ChartSelectorComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h4 className="instructions">1. Choose to create a visualization based on a) contributions over time, b) Breakdown of Contributions</h4>
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
