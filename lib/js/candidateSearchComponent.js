'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _addons = require('react/addons');

var _addons2 = _interopRequireDefault(_addons);

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _rxReact = require('rx-react');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CandidateSearchComponent = function (_React$Component) {
    _inherits(CandidateSearchComponent, _React$Component);

    function CandidateSearchComponent(props) {
        _classCallCheck(this, CandidateSearchComponent);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CandidateSearchComponent).call(this, props));

        _this.componentWillMount.bind(_this);
        _this.state = {
            availableCandidates: []
        };
        return _this;
    }

    _createClass(CandidateSearchComponent, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var self = this;
            this.inputValue = _rxReact.FuncSubject.create(function (event) {
                return event.target.value;
            });

            this.inputValue.debounce(500).distinctUntilChanged().flatMapLatest(function (value) {
                return _api2.default.search(value);
            }).subscribe(function (data) {
                self.setState({ availableCandidates: data });
            }, function (errorr) {
                console.log(error);
            });
        }
    }, {
        key: '_handleAvailableCandidateClicked',
        value: function _handleAvailableCandidateClicked(candidate) {
            this.props.onCandidateClicked(candidate);
        }
    }, {
        key: 'render',
        value: function render() {
            var _handleAvailableCandidateClicked = this._handleAvailableCandidateClicked;
            var self = this;
            var candidates = this.state.availableCandidates.map(function (c, index) {
                return _addons2.default.createElement(
                    _reactBootstrap.ListGroupItem,
                    { key: 'available' + index, onClick: _handleAvailableCandidateClicked.bind(self, c) },
                    c.displayName
                );
            });
            return _addons2.default.createElement(
                'div',
                { className: 'block candidate-search' },
                _addons2.default.createElement(
                    'h4',
                    { className: 'instructions' },
                    '2. Search for candidates to visualize'
                ),
                _addons2.default.createElement('input', { onInput: this.inputValue, placeholder: 'Search for a candidate' }),
                _addons2.default.createElement(
                    _reactBootstrap.ListGroup,
                    null,
                    candidates
                )
            );
        }
    }]);

    return CandidateSearchComponent;
}(_addons2.default.Component);

exports.default = CandidateSearchComponent;