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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CandidatesListComponent = function (_React$Component) {
    _inherits(CandidatesListComponent, _React$Component);

    function CandidatesListComponent(props) {
        _classCallCheck(this, CandidatesListComponent);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CandidatesListComponent).call(this, props));
    }

    _createClass(CandidatesListComponent, [{
        key: 'render',
        value: function render() {
            var onCandidateSelected = this.props.onCandidateSelected;
            var checks = this.props.availableCandidates.map(function (candidate) {
                return _addons2.default.createElement(_reactBootstrap.Input, { type: 'checkbox', label: candidate.name, key: candidate.id, checked: candidate.selected, onChange: onCandidateSelected.bind(this, candidate) });
            });
            return _addons2.default.createElement(
                'div',
                { className: 'candidate-list' },
                _addons2.default.createElement(
                    'form',
                    null,
                    checks
                )
            );
        }
    }]);

    return CandidatesListComponent;
}(_addons2.default.Component);

exports.default = CandidatesListComponent;