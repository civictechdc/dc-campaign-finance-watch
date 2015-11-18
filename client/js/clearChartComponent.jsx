import React from 'react/addons';
import {Button} from 'react-bootstrap';

class ClearChartComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Button onClick={this.props.onClear}>Clear the Chart</Button>
        );
    }
}

export default ClearChartComponent;
