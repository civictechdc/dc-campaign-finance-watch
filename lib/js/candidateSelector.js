'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _addons = require('react/addons');

var _addons2 = _interopRequireDefault(_addons);

var _dateRange = require('./dateRange.jsx');

var _dateRange2 = _interopRequireDefault(_dateRange);

var _candidateList = require('./candidateList.jsx');

var _candidateList2 = _interopRequireDefault(_candidateList);

var _reactBootstrap = require('react-bootstrap');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CandidateSelectorComponent = function (_React$Component) {
  _inherits(CandidateSelectorComponent, _React$Component);

  function CandidateSelectorComponent(props) {
    _classCallCheck(this, CandidateSelectorComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CandidateSelectorComponent).call(this, props));

    _this._rangeSelected.bind(_this);
    _this.state = { range: {}, candidates: [] };

    return _this;
  }

  _createClass(CandidateSelectorComponent, [{
    key: '_rangeSelected',
    value: function _rangeSelected(toDate, fromDate) {
      var that = this;
      _api2.default.getCandidates(toDate, fromDate).then(function (candidates) {
        that.setState({ candidates: candidates,
          range: { toDate: toDate, fromDate: fromDate }
        });
      });
    }
  }, {
    key: '_candidateSelected',
    value: function _candidateSelected(id) {
      var candidates = this.state.candidates.map(function (candidate) {
        if (candidate.id === id) {
          candidate.selected = !candidate.selected;
        }
        return candidate;
      });
      this.setState({ candidates: candidates });
    }
  }, {
    key: '_submitSelectedCandidates',
    value: function _submitSelectedCandidates() {
      var selectedCandidates = this.state.candidates.filter(function (c) {
        return c.selected;
      });
      this.props.onSelectedCandidatesSumbitted(_lodash2.default.pluck(selectedCandidates, 'id'), this.state.range);
      var candidates = this.state.candidates.map(function (c) {
        c.selected = false;
        return c;
      });

      this.setState({ candidates: candidates });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _addons2.default.createElement(
        'div',
        null,
        _addons2.default.createElement(
          'h4',
          null,
          '2. Select a beginning and end date for the visualization, followed by which candidates should be shown. Due to resource constraints, please select a maximum of two candidates.'
        ),
        _addons2.default.createElement(_dateRange2.default, {
          range: this.state.range,
          onRangeInput: function onRangeInput(toDate, fromDate) {
            return _this2._rangeSelected(toDate, fromDate);
          } }),
        _addons2.default.createElement(_candidateList2.default, {
          candidates: this.state.candidates,
          onCandidateSelection: function onCandidateSelection(id) {
            return _this2._candidateSelected(id);
          } })
      );
    }
  }]);

  return CandidateSelectorComponent;
}(_addons2.default.Component);

exports.default = CandidateSelectorComponent;