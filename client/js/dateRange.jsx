import Moment from 'moment';
import React from 'react/addons';

class DateRangeComponent extends React.Component {
  constructor(props){
    super(props);
  }

  handleChange() {
    let toDate = Moment(this.refs.to.getDOMNode().value, 'YYYY-MM-DD');
    let fromDate = Moment(this.refs.from.getDOMNode().value, 'YYYY-MM-DD');
    if(toDate.isValid() && fromDate.isValid()) {
      this.props.onRangeInput(toDate, fromDate);
    }
  }

  render(){
    return (
      <div>
        <label>To:</label>
        <input type="date"
          name="dateFrom"
          value={this.props.range.from}
          ref="from"
          onChange={this.handleChange.bind(this)}/>
        <label>From:</label>
        <input type="date"
          name="dateTo"
          value={this.props.range.to}
          ref="to"
          onChange={this.handleChange.bind(this)}/>
      </div>
    )
  }
}

export default DateRangeComponent;
