import React from 'react/addons';
import ClearChartComponent from './clearChartComponent.jsx';
import DownloadChartComponent from './downloadChartComponent.jsx';
import Chart from './chart.jsx';

class ChartContainerComponent extends React.Component {
    constructor (props) {
        super(props);
    }

    _setSvg (svg) {
        this.setState({'svg': svg});
    }

    _downloadChart () {
        console.info('beginning chart download');
    }

    render () {
        if(this.props.chartInfo) {
            return (
                <div>
                    <Chart onSvgCreate={this
                        ._setSvg
                        .bind(this)} chartInfo={this.props.chartInfo} domain={this.props.domain}></Chart>
                    <ClearChartComponent onClear={this.props.clearChart}></ClearChartComponent>
                    <DownloadChartComponent onDownload={this._downloadChart}></DownloadChartComponent>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default ChartContainerComponent;
