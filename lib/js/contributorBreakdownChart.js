'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContributorBreakdownChart = function () {
  function ContributorBreakdownChart(el, state) {
    _classCallCheck(this, ContributorBreakdownChart);

    _d2.default.select(el).select('.chart').append('svg');
    this.svg = _d2.default.select(el).select('svg');
    this.type = 'contributorBreakdown';
    if (state.data) {
      this.update(el, state);
    }
  }

  _createClass(ContributorBreakdownChart, [{
    key: 'update',
    value: function update(el, state) {
      this._drawPoints(el, state.data);
    }
  }, {
    key: '_drawPoints',
    value: function _drawPoints(el, data) {
      this.svg.selectAll('*').remove();
      var width = el.offsetWidth;
      var height = el.offsetHeight < 600 ? el.offsetHeight : 600;

      var margin = { top: 50, right: 100, bottom: 50, left: 100 };

      var x = _d2.default.scale.ordinal().rangeRoundBands([0, width], .5);

      var y = _d2.default.scale.linear().rangeRound([height, 0], .9);

      var color = _d2.default.scale.ordinal().range(['#98abc5', '#8a89a6', '#7b6888']);

      var xAxis = _d2.default.svg.axis().scale(x).orient("bottom");

      var yAxis = _d2.default.svg.axis().scale(y).orient("left").tickFormat(_d2.default.format(".2s"));

      var svg = this.svg.attr("width", width).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      color.domain(_d2.default.keys(data[0]).filter(function (key) {
        return key !== 'name';
      }));

      data.forEach(function (d) {
        var y0 = 0;
        d.percents = color.domain().map(function (type) {
          return { type: type, y0: y0, y1: y0 += +d[type] };
        });
        d.total = 100;
      });

      x.domain(data.map(function (d) {
        return d.name;
      }));
      y.domain([0, 100]);

      svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);

      svg.append('g').attr('class', 'y axis').call(yAxis).append('text').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.71em').style('text-anchor', 'end').text('Percentage');

      var candidate = svg.selectAll('.candidate').data(data).enter().append('g').attr('class', 'g').attr('transform', function (d) {
        return 'translate(' + x(d.name) + ',0)';
      });

      candidate.selectAll('rect').data(function (d) {
        return d.percents;
      }).enter().append('rect').attr('width', x.rangeBand() - 15).attr('y', function (d) {
        return y(d.y1);
      }).attr('height', function (d) {
        return y(d.y0) - y(d.y1);
      }).style('fill', function (d) {
        return color(d.type);
      });

      var legend = svg.selectAll('.legend').data(color.domain().slice().reverse()).enter().append('g').attr('class', 'legend').attr('transform', function (d, i) {
        return 'translate(-' + i * 100 + ',-20)';
      });

      legend.append("rect").attr("x", width - 188).attr("width", 18).attr("height", 18).style("fill", color);

      legend.append("text").attr("x", width - 194).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function (d) {
        return d;
      });
    }
  }, {
    key: 'destroy',
    value: function destroy(el) {
      // NOOP
    }
  }]);

  return ContributorBreakdownChart;
}();

exports.default = ContributorBreakdownChart;