'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContributionOverTimeChart = function () {
  function ContributionOverTimeChart(el, state) {
    _classCallCheck(this, ContributionOverTimeChart);

    _d2.default.select(el).select('.chart').append('svg');
    this.svg = _d2.default.select(el).select('svg');
    this.type = 'contributionOverTime';
    if (state.data) {
      this.update(el, state);
    }
  }

  _createClass(ContributionOverTimeChart, [{
    key: 'update',
    value: function update(el, state) {
      this._drawPoints(el, state.data);
    }
  }, {
    key: '_drawPoints',
    value: function _drawPoints(el, data) {
      this.svg.selectAll('*').remove();
      var width = el.offsetWidth;
      var height = el.offsetHeight;

      var margin = { top: 50, right: 100, bottom: 50, left: 100 };

      var parseDate = _d2.default.time.format("%Y%m%d").parse;

      data.forEach(function (d) {
        d.date = parseDate(d.date);
      });

      var x = _d2.default.time.scale().range([0, width - margin.right - margin.left]);

      var y = _d2.default.scale.linear().range([height - margin.top - margin.bottom, 0]);

      var color = _d2.default.scale.category10().domain(_d2.default.keys(data[0]).filter(function (key) {
        return key !== 'date';
      }));

      var xAxis = _d2.default.svg.axis().scale(x).ticks(_d2.default.time.months).tickSize(16, 0).tickFormat(_d2.default.time.format("%B")).orient("bottom");

      var yAxis = _d2.default.svg.axis().scale(y).tickFormat(function (d) {
        return "$" + d || 0;
      }).orient("left");

      var line = _d2.default.svg.line().interpolate("basis").x(function (d) {
        return x(d.date);
      }).y(function (d) {
        return y(d.amount);
      });

      var svg = this.svg.attr("width", width).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var candidates = color.domain().map(function (name) {
        return {
          name: name,
          values: data.map(function (d) {
            return { date: d.date, amount: +d[name] };
          })
        };
      });

      // Grab the min and max contribution dates
      x.domain(_d2.default.extent(data, function (d) {
        return d.date;
      }));

      y.domain([_d2.default.min(candidates, function (c) {
        return _d2.default.min(c.values, function (v) {
          return v.amount;
        });
      }), _d2.default.max(candidates, function (c) {
        return _d2.default.max(c.values, function (v) {
          return v.amount;
        });
      })]);

      svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")").call(xAxis);

      svg.append('g').attr('class', 'y axis').call(yAxis).append('text').attr('transfrom', 'rotate(-90)').attr('y', -20).attr('dy', '.71em').attr('text-anchor', 'end').text('Contributions');

      var candidate = svg.selectAll('.candidate').data(candidates).enter().append('g').attr('class', 'candidate');

      candidate.append('path').attr('class', 'line').attr('d', function (d) {
        return line(d.values);
      }).style('stroke', function (d) {
        return color(d.name);
      });

      candidate.append('text').datum(function (d) {
        return { name: d.name, value: d.values[d.values.length - 1] };
      }).attr('transform', function (d) {
        return 'translate(' + x(d.value.date) + ',' + y(d.value.amount) + ')';
      }).attr('x', 3).attr('dy', '.35em').attr('text-anchor', 'start').text(function (d) {
        return d.name;
      });
    }
  }, {
    key: 'destroy',
    value: function destroy(el) {
      // NOOP
    }
  }]);

  return ContributionOverTimeChart;
}();

exports.default = ContributionOverTimeChart;