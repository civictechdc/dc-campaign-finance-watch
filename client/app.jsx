import React from 'react/addons';
import Chart from './chart.jsx'

let sampleData = [
  {date: '20151001', can1: 2, can2: 3},
  {date: '20151101', can1: 11, can2: 15},
  {date: '20151201', can1: 24, can2: 35},
];


class AppRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: sampleData,
      domain: {x: [0, 30], y: [0, 100]}
    }
  }

  getInitialState() {
    return {
      data: sampleData,
      domain: {x: [0, 30], y: [0, 100]}
    };
  }

  render() {
    return (
      <div>
        <h1>DC Campaign Finance</h1>
        <Chart data={this.state.data}
              domain={this.state.domain}/>
      </div>
    )
  }
}

React.render(<AppRoot/>, document.body);
