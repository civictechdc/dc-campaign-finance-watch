'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _addons = require('react/addons');

var _addons2 = _interopRequireDefault(_addons);

var _reactBootstrapDaterangepicker = require('react-bootstrap-daterangepicker');

var _reactBootstrapDaterangepicker2 = _interopRequireDefault(_reactBootstrapDaterangepicker);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DateRangeComponent = function (_React$Component) {
    _inherits(DateRangeComponent, _React$Component);

    function DateRangeComponent(props) {
        _classCallCheck(this, DateRangeComponent);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DateRangeComponent).call(this, props));

        _this.minimumDate = (0, _moment2.default)('01/01/2007', 'MM/DD/YYYY');
        _this.maximumDate = (0, _moment2.default)(new Date());
        _this.state = {
            ranges: {
                'Last Year': [(0, _moment2.default)().subtract(1, 'years'), (0, _moment2.default)()],
                'Last Two Years': [(0, _moment2.default)().subtract(2, 'years'), (0, _moment2.default)()]
            },
            startDate: (0, _moment2.default)().subtract(4, 'years'),
            endDate: (0, _moment2.default)()
        };
        return _this;
    }

    _createClass(DateRangeComponent, [{
        key: 'handleChange',
        value: function handleChange(event, picker) {
            this.setState({ 'startDate': picker.startDate, 'endDate': picker.endDate });
            this.props.onRangeInput(picker.endDate, picker.startDate);
        }
    }, {
        key: 'render',
        value: function render() {
            var start = this.state.startDate.format('YYYY-MM-DD');
            var end = this.state.endDate.format('YYYY-MM-DD');
            var label = start + ' - ' + end;
            if (start === end) {
                label = start;
            }
            var dateStyle = { width: '50%' };
            return _addons2.default.createElement(
                'div',
                { className: 'block' },
                _addons2.default.createElement(
                    'h4',
                    { className: 'instructions' },
                    '3. Select a range of dates to pull data from.'
                ),
                _addons2.default.createElement(
                    _reactBootstrapDaterangepicker2.default,
                    { style: dateStyle, startDate: this.state.startDate, endDate: this.state.endDate, ranges: this.state.ranges, onApply: this.handleChange.bind(this) },
                    _addons2.default.createElement(
                        _reactBootstrap.Button,
                        { className: 'selected-date-range-btn', style: { width: '100%' } },
                        _addons2.default.createElement(
                            'div',
                            { className: 'pull-left' },
                            _addons2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'calendar' })
                        ),
                        _addons2.default.createElement(
                            'div',
                            { className: 'pull-right' },
                            _addons2.default.createElement(
                                'span',
                                null,
                                label
                            ),
                            _addons2.default.createElement('span', { className: 'caret' })
                        )
                    )
                )
            );
        }
    }]);

    return DateRangeComponent;
}(_addons2.default.Component);

exports.default = DateRangeComponent;