'use strict';

import moment from 'moment';
import React from 'react/addons';
import DayPicker, { DateUtils } from "react-day-picker";
import {Button, Glyphicon, Grid, Col, ButtonGroup} from 'react-bootstrap';

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
        this.setState({
            startDate: modifiers.indexOf("selected") > -1 ? null : moment(day.toISOString())
        });
        this.props.onRangeInput(this.state.endDate, this.state.startDate);
    }

    handleEndDateClick(event, day, modifiers){
        this.setState({
            endDate: modifiers.indexOf("selected") > -1 ? null : moment(day.toISOString())
        });
        console.log(this.state.endDate);
        console.log(this.state.startDate);
        this.props.onRangeInput(this.state.endDate, this.state.startDate);
    }

    handleYearsPreset(years){
        this.setState({
            startDate: moment().subtract(years, 'years'),
            endDate: moment()
        });
    }

    handleYearPreset(){
        this.handleYearsPreset(1);
    }

    handleTwoYearsPreset(){
        this.handleYearsPreset(2);
    }

    handleTenYearsPreset(){
        this.handleYearsPreset(10);
    }

    render(){
        return (
            <Grid className="date-range">
                <h4 className="instructions">
                    3. Select a range of dates to pull data from
                </h4>
                <ButtonGroup>
                    <Button onClick={this.handleYearPreset.bind(this)}> Last Year </Button>
                    <Button onClick={this.handleTwoYearsPreset.bind(this)}> Last 2 Years </Button>
                    <Button onClick={this.handleTenYearsPreset.bind(this)}> Last 10 Years </Button>
                </ButtonGroup>
                <hr/>
                <Col className="show-grid" xs={6} md={4}>
                    <h5> Custom Start Date </h5>
                    <DayPicker
                        initialMonth={ this.state.startDate.toDate()}
                        onDayClick={this.handleStartDateClick.bind(this)}
                        modifiers={{
                        selected: day => DateUtils.isSameDay(this.state.startDate.toDate(), day)
                      }}
                    />
                </Col>
                <Col className="show-grid" xs={6} md={4}>
                    <h5>Custom End Date </h5>
                    <DayPicker
                        initialMonth={this.state.endDate.toDate()}
                        onDayClick={this.handleEndDateClick.bind(this)}
                        modifiers={{
                        selected: day => DateUtils.isSameDay(this.state.endDate.toDate(), day)
                      }}
                    />
                </Col>
            </Grid>
        );
    }
}

export default DateRangeComponent;
