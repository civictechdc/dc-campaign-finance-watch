import React from 'react/addons';
import ClearChartComponent from './clearChartComponent.jsx';
import DownloadChartComponent from './downloadChartComponent.jsx';
import Chart from './chart.jsx';
import {
    Button
} from 'react-bootstrap';
import Client from './api';

class ChartContainerComponent extends React.Component {
    constructor (props) {
        super(props);
    }

    _setSvg (svg) {
        this.setState({'svg': svg});
    }

    _downloadChart () {
        console.info('beginning chart download', this.state.svg);
        Client.convertSvg(this.state.svg[0][0]);
    }

    render () {
        if(this.props.chartInfo) {
            return (
                <div>
                    <Chart onSvgCreate={this
                        ._setSvg
                        .bind(this)} chartInfo={this.props.chartInfo} domain={this.props.domain}></Chart>
                    <ClearChartComponent onClear={this.props.clearChart}></ClearChartComponent>
                    <Button onClick={this._downloadChart.bind(this)}>Download Visualization</Button>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default ChartContainerComponent;
