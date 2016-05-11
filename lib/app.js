'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _addons = require('react/addons');

var _addons2 = _interopRequireDefault(_addons);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _chartContainerComponent = require('./js/chartContainerComponent.jsx');

var _chartContainerComponent2 = _interopRequireDefault(_chartContainerComponent);

var _candidateSelector = require('./js/candidateSelector.jsx');

var _candidateSelector2 = _interopRequireDefault(_candidateSelector);

var _chartSelector = require('./js/chartSelector.jsx');

var _chartSelector2 = _interopRequireDefault(_chartSelector);

var _createChartComponent = require('./js/createChartComponent.jsx');

var _createChartComponent2 = _interopRequireDefault(_createChartComponent);

var _chartDataProcessor = require('./js/chartDataProcessor');

var _restler = require('restler');

var _restler2 = _interopRequireDefault(_restler);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _api = require('./js/api');

var _api2 = _interopRequireDefault(_api);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AppRoot = function (_React$Component) {
    _inherits(AppRoot, _React$Component);

    function AppRoot(props) {
        _classCallCheck(this, AppRoot);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AppRoot).call(this, props));

        _this.state = {
            domain: {
                x: [0, 30],
                y: [0, 100]
            },
            chartInfo: {}
        };
        return _this;
    }

    _createClass(AppRoot, [{
        key: '_setChartData',
        value: function _setChartData(chartInfo) {
            this.setState({ chartInfo: chartInfo });
        }

        // _handleCandidateSelection (id) {
        //     var selectedCandidates = this.state.selectedCandidates;
        //     selectedCandidates.push(id);
        //     this.setState({selectedCandidates: selectedCandidates});
        // }

        // _handleCandidateDeselection (id) {
        //     var selectedCandidates = _.remove(this.state.selectedCandidates, function (c) {
        //         return c === id;
        //     });
        //     this.setState({selectedCandidates: selectedCandidates});
        // }

        // _handleChartSelection (chart) {
        //     this.setState({selectedChart: chart});
        // }

        // _getChartData (candidates, range) {
        //     var dataPromise;
        //     var chart = this.state.selectedChart;
        //     switch (chart) {
        //         case "contributionOverTime":
        //             dataPromise = ProcessContributionsOverTime(candidates, range);
        //             break;
        //         case "contributorBreakdown":
        //             dataPromise = ProcessContributorBreakdown(candidates, range);
        //             break;
        //         default:
        //             break;
        //     }
        //     dataPromise
        //         .bind(this)
        //         .then(function (results) {
        //             this.setState({data: results});
        //             this.state.selectedCandidates = [];
        //         })
        //         .catch(function (err) {
        //             console.log(err);
        //         });
        // }

    }, {
        key: 'render',
        value: function render() {
            var candidates = this.state.candidates || [];
            return _addons2.default.createElement(
                'div',
                { className: 'block-group' },
                _addons2.default.createElement(
                    'header',
                    null,
                    _addons2.default.createElement(
                        'div',
                        { className: 'header block' },
                        _addons2.default.createElement(
                            'span',
                            null,
                            'DC Campaign Finance'
                        )
                    )
                ),
                _addons2.default.createElement(
                    'main',
                    null,
                    _addons2.default.createElement(
                        'div',
                        { className: 'block sub-header' },
                        _addons2.default.createElement(
                            'h2',
                            null,
                            'Welcome to DC Campaign Finance'
                        ),
                        _addons2.default.createElement(
                            'h3',
                            null,
                            'What information is on this site?'
                        ),
                        _addons2.default.createElement(
                            'ul',
                            null,
                            _addons2.default.createElement(
                                'li',
                                null,
                                'Where political campaign funds come from'
                            ),
                            _addons2.default.createElement(
                                'li',
                                null,
                                'How much money different candidates have raised over time'
                            )
                        )
                    ),
                    _addons2.default.createElement(
                        'div',
                        { className: 'block main' },
                        _addons2.default.createElement(
                            'div',
                            { className: 'block-group' },
                            _addons2.default.createElement(
                                'div',
                                { className: 'block main-header' },
                                _addons2.default.createElement(
                                    'h5',
                                    null,
                                    'How does it work?'
                                )
                            ),
                            _addons2.default.createElement(_createChartComponent2.default, { setChartData: this._setChartData.bind(this) })
                        )
                    ),
                    _addons2.default.createElement(
                        'div',
                        { className: 'block graph' },
                        _addons2.default.createElement(_chartContainerComponent2.default, { chartInfo: this.state.chartInfo, domain: this.state.domain })
                    )
                )
            );
        }
    }]);

    return AppRoot;
}(_addons2.default.Component);

_reactDom2.default.render(_addons2.default.createElement(AppRoot, null), document.getElementById('app'));