'use strict';

import moment from 'moment';
import React from 'react/addons';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {Button, Glyphicon} from 'react-bootstrap';

class DateRangeComponent extends React.Component {
    constructor (props) {
        super(props);
        this.minimumDate = moment('01/01/2007', 'MM/DD/YYYY');
        this.maximumDate = moment(new Date());
        this.state =  {
			ranges: {
				'Last Year': [moment().subtract(1, 'years'), moment()],
				'Last Two Years': [moment().subtract(2, 'years'), moment()]
			},
			startDate: moment().subtract(4, 'years'),
			endDate: moment()
		};
    }

    handleChange (event, picker) {
        this.setState({'startDate': picker.startDate, 'endDate': picker.endDate});
        this.props.onRangeInput(picker.endDate, picker.startDate);
    }

    render () {
        var start = this.state.startDate.format('YYYY-MM-DD');
		var end = this.state.endDate.format('YYYY-MM-DD');
		var label = start + ' - ' + end;
		if (start === end) {
			label = start;
		}
        let dateStyle = {width: '50%'};
        return (
            <div className="block">
                <h4 className="instructions">3. Select a range of dates to pull data from.</h4>
                <DateRangePicker style={dateStyle} startDate={this.state.startDate} endDate={this.state.endDate} ranges={this.state.ranges} onApply={this.handleChange.bind(this)}>
    						<Button className="selected-date-range-btn" style={{width:'100%'}}>
    							<div className="pull-left"><Glyphicon glyph="calendar" /></div>
    							<div className="pull-right">
    								<span>
    									{label}
    								</span>
    								<span className="caret"></span>
    							</div>
    						</Button>
    				</DateRangePicker>
            </div>
        );
    }
}

export default DateRangeComponent;
