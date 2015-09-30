import Moment from 'moment';
import React from 'react/addons';

class DateRangeComponent extends React.Component {
  constructor(props){
    super(props);
    this.minimumDate = Moment('01/01/2007', 'MM/DD/YYYY');
    this.maximumDate = Moment(new Date());
  }

  handleChange() {
    let toDate = Moment(this.refs.to.getDOMNode().value, 'YYYY-MM-DD');
    let fromDate = Moment(this.refs.from.getDOMNode().value, 'YYYY-MM-DD');
    if(this.areDatesValid(fromDate, toDate)) {
      this.props.onRangeInput(toDate, fromDate);
    }
  }

  areDatesValid(fromD, toD) {
    return fromD.isValid() && toD.isValid() &&
      fromD.isBetween(this.minimumDate, this.maximumDate)
      && toD.isBetween(this.minimumDate, this.maximumDate);
  }

  render(){
    return (
      <div>
        <label>From:</label>
        <input type="date"
          name="dateFrom"
          value={this.props.range.from}
          ref="from"
          onChange={this.handleChange.bind(this)}/>
        <label>To:</label>
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
