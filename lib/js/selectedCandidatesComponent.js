'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _addons = require('react/addons');

var _addons2 = _interopRequireDefault(_addons);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectedCandidatesComponent = function (_React$Component) {
    _inherits(SelectedCandidatesComponent, _React$Component);

    function SelectedCandidatesComponent(props) {
        _classCallCheck(this, SelectedCandidatesComponent);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SelectedCandidatesComponent).call(this, props));
    }

    _createClass(SelectedCandidatesComponent, [{
        key: '_handleRemoveCandidateClicked',
        value: function _handleRemoveCandidateClicked(candidate) {
            this.props.onCandidateRemove(candidate);
        }
    }, {
        key: 'render',
        value: function render() {
            var removeCandidate = this._handleRemoveCandidateClicked;
            var self = this;
            if (this.props.selectedCandidates) {
                var candidates = this.props.selectedCandidates.map(function (c, index) {
                    return _addons2.default.createElement(
                        'div',
                        { key: 'selected_' + index },
                        _addons2.default.createElement(
                            'span',
                            null,
                            c.displayName
                        ),
                        _addons2.default.createElement(
                            _reactBootstrap.Button,
                            { onClick: removeCandidate.bind(self, c) },
                            _addons2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'remove' })
                        )
                    );
                });
                return _addons2.default.createElement(
                    'div',
                    { className: 'block selected-candidates' },
                    candidates
                );
            }
        }
    }]);

    return SelectedCandidatesComponent;
}(_addons2.default.Component);

exports.default = SelectedCandidatesComponent;