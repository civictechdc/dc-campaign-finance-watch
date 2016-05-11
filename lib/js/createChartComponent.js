'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _addons = require('react/addons');

var _addons2 = _interopRequireDefault(_addons);

var _reactBootstrap = require('react-bootstrap');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _chartSelector = require('./chartSelector.jsx');

var _chartSelector2 = _interopRequireDefault(_chartSelector);

var _dateRange = require('./dateRange.jsx');

var _dateRange2 = _interopRequireDefault(_dateRange);

var _candidateList = require('./candidateList.jsx');

var _candidateList2 = _interopRequireDefault(_candidateList);

var _chartDataProcessor = require('./chartDataProcessor');

var _candidateSearchComponent = require('./candidateSearchComponent.jsx');

var _candidateSearchComponent2 = _interopRequireDefault(_candidateSearchComponent);

var _selectedCandidatesComponent = require('./selectedCandidatesComponent.jsx');

var _selectedCandidatesComponent2 = _interopRequireDefault(_selectedCandidatesComponent);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreateChartComponent = function (_React$Component) {
    _inherits(CreateChartComponent, _React$Component);

    function CreateChartComponent(props) {
        _classCallCheck(this, CreateChartComponent);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CreateChartComponent).call(this, props));

        _this.state = {
            selectedCandidates: [],
            dataSet: null,
            beginning: null,
            end: null
        };
        return _this;
    }

    _createClass(CreateChartComponent, [{
        key: '_handleCandidateSelected',
        value: function _handleCandidateSelected(candidate) {
            var selectedCandidates = this.state.selectedCandidates;
            selectedCandidates.unshift(candidate);
            this.setState({ selectedCandidates: selectedCandidates });
        }
    }, {
        key: '_handleSetSelected',
        value: function _handleSetSelected(set) {
            this.setState({ dataSet: set });
        }
    }, {
        key: '_handleRangeSelected',
        value: function _handleRangeSelected(end, beginning) {
            this.setState({ beginning: beginning, end: end });
        }
    }, {
        key: '_clearSelectedCandidates',
        value: function _clearSelectedCandidates() {
            var unselected = this.state.selectedCandidates.map(function (c) {
                c.selected = false;
                return c;
            });
            this.setState({ candidates: unselected });
        }
    }, {
        key: '_handleRemoveSelectedCandidate',
        value: function _handleRemoveSelectedCandidate(candidate) {
            var selectedCandidates = this.state.selectedCandidates;
            _lodash2.default.remove(selectedCandidates, function (c) {
                return c.id === candidate.id;
            });
            this.setState({ selectedCandidates: selectedCandidates });
        }
    }, {
        key: '_handleCreateChart',
        value: function _handleCreateChart() {
            var dataPromise;
            var range = {
                fromDate: this.state.beginning,
                toDate: this.state.end
            };
            console.log(range);
            var chart = this.state.dataSet;
            var candidates = this.state.selectedCandidates;

            switch (chart) {
                case "contributionOverTime":
                    dataPromise = (0, _chartDataProcessor.ProcessContributionsOverTime)(candidates, range);
                    break;
                case "contributorBreakdown":
                    dataPromise = (0, _chartDataProcessor.ProcessContributorBreakdown)(candidates, range);
                    break;
                case "contributorDendogram":
                    dataPromise = (0, _chartDataProcessor.ProcessContributionsToTree)(candidates, range);
                    break;
                default:
                    break;
            }
            dataPromise.bind(this).then(function (results) {
                this.props.setChartData({ data: results, type: chart });
                this._clearSelectedCandidates();
            }).catch(function (err) {
                console.log(err);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _addons2.default.createElement(
                'div',
                { className: 'block-group' },
                _addons2.default.createElement(_chartSelector2.default, { onChartSelected: this._handleSetSelected.bind(this) }),
                _addons2.default.createElement(_candidateSearchComponent2.default, { onCandidateClicked: this._handleCandidateSelected.bind(this) }),
                _addons2.default.createElement(_selectedCandidatesComponent2.default, { selectedCandidates: this.state.selectedCandidates, onCandidateRemove: this._handleRemoveSelectedCandidate.bind(this) }),
                _addons2.default.createElement(_dateRange2.default, { onRangeInput: this._handleRangeSelected.bind(this) }),
                _addons2.default.createElement(
                    'div',
                    { className: 'block-group' },
                    _addons2.default.createElement(
                        'h4',
                        { className: 'instructions' },
                        '4. View the visualization'
                    ),
                    _addons2.default.createElement(
                        _reactBootstrap.Button,
                        { onClick: this._handleCreateChart.bind(this) },
                        'Create visualization'
                    )
                )
            );
        }
    }]);

    return CreateChartComponent;
}(_addons2.default.Component);

exports.default = CreateChartComponent;