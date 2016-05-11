'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _addons = require('react/addons');

var _addons2 = _interopRequireDefault(_addons);

var _clearChartComponent = require('./clearChartComponent.jsx');

var _clearChartComponent2 = _interopRequireDefault(_clearChartComponent);

var _downloadChartComponent = require('./downloadChartComponent.jsx');

var _downloadChartComponent2 = _interopRequireDefault(_downloadChartComponent);

var _chart = require('./chart.jsx');

var _chart2 = _interopRequireDefault(_chart);

var _reactBootstrap = require('react-bootstrap');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChartContainerComponent = function (_React$Component) {
    _inherits(ChartContainerComponent, _React$Component);

    function ChartContainerComponent(props) {
        _classCallCheck(this, ChartContainerComponent);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ChartContainerComponent).call(this, props));
    }

    _createClass(ChartContainerComponent, [{
        key: '_setSvg',
        value: function _setSvg(svg) {
            this.setState({ 'svg': svg });
        }
    }, {
        key: '_downloadChart',
        value: function _downloadChart() {
            console.info('beginning chart download', this.state.svg);
            alert('This feature is still pending work.');
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.props.chartInfo) {
                return _addons2.default.createElement(
                    'div',
                    null,
                    _addons2.default.createElement(_chart2.default, { onSvgCreate: this._setSvg.bind(this), chartInfo: this.props.chartInfo, domain: this.props.domain }),
                    _addons2.default.createElement(_clearChartComponent2.default, { onClear: this.props.clearChart }),
                    _addons2.default.createElement(
                        _reactBootstrap.Button,
                        { onClick: this._downloadChart.bind(this) },
                        'Download Visualization'
                    )
                );
            } else {
                return null;
            }
        }
    }]);

    return ChartContainerComponent;
}(_addons2.default.Component);

exports.default = ChartContainerComponent;