'use strict';

import moment from 'moment';
import React from 'react/addons';
import DayPicker, { DateUtils } from "react-day-picker";
import {Button, Glyphicon} from 'react-bootstrap';

class DateRangeComponent extends React.Component {
    constructor(props){
        super(props);
        this.minimumDate = moment('01/01/2007', 'MM/DD/YYYY');
        this.maximumDate = moment(new Date());
        this.state = {
            ranges: {
                'Last Year': [moment().subtract(1, 'years'), moment()],
                'Last Two Years': [moment().subtract(2, 'years'), moment()]
            },
            startDate: moment().subtract(4, 'years'),
            endDate: moment()
        };
    }

    handleStartDateClick(event, day, modifiers){
        console.log(day.toISOString());
        this.setState({
            startDate: modifiers.indexOf("selected") > -1 ? null : moment(day.toISOString())
        });
        this.props.onRangeInput(this.state.endDate, this.state.startDate);
    }

    handleEndDateClick(event, day, modifiers){
        this.setState({
            endDate: modifiers.indexOf("selected") > -1 ? null : moment(day.toISOString())
        });
    }

    render(){
        var start = this.state.startDate.format('YYYY-MM-DD');
        var end = this.state.endDate.format('YYYY-MM-DD');

        console.log(start);
        console.log(end);

        var label = start + ' - ' + end;
        if (start === end) {
            label = start;
        }

        return (

            <div className="date-range">
                <h4 className="instructions">
                    3. Select a range of dates to pull data from
                </h4>
                <h3> Start Date </h3>
                <DayPicker
                    initialMonth={ moment().subtract(4, 'years').toDate()}
                    onDayClick={this.handleStartDateClick.bind(this)}
                />
                <h3> End Date </h3>
                <DayPicker
                    initialMonth={moment().toDate()}
                    onDayClick={this.handleEndDateClick.bind(this)}
                />
            </div>
        );
    }
}

export default DateRangeComponent;
