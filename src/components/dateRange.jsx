'use strict';

import moment from 'moment';
import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import {Button, Col, ButtonGroup, Row} from 'react-bootstrap';

class DateRangeComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            startDate: moment().subtract(4,'years'),
            endDate: moment()
        };
    }

    handleStartDateClick(event, day, modifiers){
        this.setState({
            startDate: modifiers.indexOf('selected') > -1 ? null : moment(day.toISOString())
        });
        this.props.onRangeInput(this.state.endDate, this.state.startDate);
    }

    handleEndDateClick(event, day, modifiers){
        this.setState({
            endDate: modifiers.indexOf('selected') > -1 ? null : moment(day.toISOString())
        });
        this.props.onRangeInput(this.state.endDate, this.state.startDate);
    }

    handleYearsPreset(years){
        let startDate = moment().subtract(years, 'years');
        let endDate = moment();
        this.setState({
            startDate: startDate,
            endDate: endDate
        });
        this.props.onRangeInput(endDate, startDate);
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
            <div>
                <Row>
                    <Col xs={12}>
                        <ButtonGroup>
                            <Button onClick={this.handleYearPreset.bind(this)}> Last Year </Button>
                            <Button onClick={this.handleTwoYearsPreset.bind(this)}> Last 2 Years </Button>
                            <Button onClick={this.handleTenYearsPreset.bind(this)}> Last 10 Years </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Row>
                            <Col className="show-grid" xs={6}>
                                <h5> Custom Start Date </h5>
                                <DayPicker
                                    initialMonth={ this.state.startDate.toDate()}
                                    onDayClick={this.handleStartDateClick.bind(this)}
                                    modifiers={{
                                    selected: day => DateUtils.isSameDay(this.state.startDate.toDate(), day)
                                  }}
                                />
                            </Col>
                            <Col className="show-grid" xs={6}>
                                <h5>Custom End Date </h5>
                                <DayPicker
                                    initialMonth={this.state.endDate.toDate()}
                                    onDayClick={this.handleEndDateClick.bind(this)}
                                    modifiers={{
                                    selected: day => DateUtils.isSameDay(this.state.endDate.toDate(), day)
                                  }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default DateRangeComponent;
