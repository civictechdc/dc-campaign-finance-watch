'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _addons = require('react/addons');

var _addons2 = _interopRequireDefault(_addons);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _contributionOverTimeChart = require('./contributionOverTimeChart');

var _contributionOverTimeChart2 = _interopRequireDefault(_contributionOverTimeChart);

var _contributorBreakdownChart = require('./contributorBreakdownChart');

var _contributorBreakdownChart2 = _interopRequireDefault(_contributorBreakdownChart);

var _contributorDendogramChart = require('./contributorDendogramChart');

var _contributorDendogramChart2 = _interopRequireDefault(_contributorDendogramChart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chart = function (_React$Component) {
    _inherits(Chart, _React$Component);

    function Chart(props) {
        _classCallCheck(this, Chart);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Chart).call(this, props));

        _this.state = {};
        return _this;
    }

    _createClass(Chart, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var el = _reactDom2.default.findDOMNode(this);
            if (this.props.chartInfo.type) {
                var chart = this.ChartFactory(this.props.chartInfo.type, el);
                this.props.onSvgCreate(chart.svg);
            }
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            if (nextProps.chartInfo === this.props.chartInfo) {
                return false;
            } else {
                return true;
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            var el = _reactDom2.default.findDOMNode(this);
            if (this.state.chart && this.state.chart.type === this.props.chartInfo.type) {
                this.state.chart.update(el, this.getChartState());
                this.props.onSvgCreate(this.state.chart.svg);
            } else {
                var chart = this.ChartFactory(this.props.chartInfo.type, el);
                this.setState({ chart: chart });
                this.props.onSvgCreate(chart.svg);
            }
        }
    }, {
        key: 'getChartState',
        value: function getChartState() {
            return { data: this.props.chartInfo.data, domain: this.props.domain };
        }
    }, {
        key: 'ChartFactory',
        value: function ChartFactory(type, el) {
            switch (type) {
                case 'contributionOverTime':
                    return new _contributionOverTimeChart2.default(el, this.getChartState());
                case 'contributorBreakdown':
                    return new _contributorBreakdownChart2.default(el, this.getChartState());
                case 'contributorDendogram':
                    return new _contributorDendogramChart2.default(el, this.getChartState());
            }
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate() {
            var el = _reactDom2.default.findDOMNode(this);
        }
    }, {
        key: 'render',
        value: function render() {
            return _addons2.default.createElement(
                'div',
                null,
                _addons2.default.createElement('div', { className: 'chart' })
            );
        }
    }]);

    return Chart;
}(_addons2.default.Component);

exports.default = Chart;