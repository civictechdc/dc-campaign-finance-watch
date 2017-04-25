import d3 from 'd3';

class ContributionOverTimeChart {
  constructor(el, state) {
    d3.select(el).select('.chart').append('svg');
    this.svg = d3.select(el).select('svg');
    this.type = 'contributionOverTime';
    if (state.data) {
      this.update(el, state);
    }
  }

  update(el, state) {
    this._drawPoints(el, state.data);
  }

  _drawPoints(el, data) {
    this.svg.selectAll('*').remove();

    let margin = { top: 50, right: 100, bottom: 50, left: 100 };
    let width = el.offsetWidth;
    let height = 700;

    let parseDate = d3.time.format('%Y%m%d').parse;

    data.forEach(function(d) {
      d.date = parseDate(d.date);
    });

    let x = d3.time.scale().range([0, width - margin.right - margin.left]);

    let y = d3.scale.linear().range([height - margin.top - margin.bottom, 0]);

    let color = d3.scale.category10().domain(
      d3.keys(data[0]).filter(function(key) {
        return key !== 'date';
      })
    );

    let xAxis = d3.svg
      .axis()
      .scale(x)
      .ticks(d3.time.months)
      .tickSize(16, 0)
      .tickFormat(d3.time.format('%b'))
      .orient('bottom');

    let yAxis = d3.svg
      .axis()
      .scale(y)
      .tickFormat(function(d) {
        return '$' + d || 0;
      })
      .orient('left');

    let line = d3.svg
      .line()
      .interpolate('basis')
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.amount);
      });

    let svg = this.svg
      .attr('width', width)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let candidates = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return { date: d.date, amount: +d[name] };
        })
      };
    });

    // Grab the min and max contribution dates
    x.domain(
      d3.extent(data, function(d) {
        return d.date;
      })
    );

    y.domain([
      d3.min(candidates, function(c) {
        return d3.min(c.values, function(v) {
          return v.amount;
        });
      }),
      d3.max(candidates, function(c) {
        return d3.max(c.values, function(v) {
          return v.amount;
        });
      })
    ]);

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr(
        'transform',
        'translate(0,' + (height - margin.top - margin.bottom) + ')'
      )
      .call(xAxis);

    svg
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transfrom', 'rotate(-90)')
      .attr('y', -20)
      .attr('dy', '.71em')
      .attr('text-anchor', 'end')
      .text('Contributions');

    let candidate = svg
      .selectAll('.candidate')
      .data(candidates)
      .enter()
      .append('g')
      .attr('class', 'candidate');

    candidate
      .append('path')
      .attr('class', 'line')
      .attr('d', function(d) {
        return line(d.values);
      })
      .style('stroke', function(d) {
        return color(d.name);
      });

    candidate
      .append('text')
      .datum(function(d) {
        return { name: d.name, value: d.values[d.values.length - 1] };
      })
      .attr('transform', function(d) {
        return 'translate(' + x(d.value.date) + ',' + y(d.value.amount) + ')';
      })
      .attr('x', 3)
      .attr('dy', '.35em')
      .attr('text-anchor', 'start')
      .text(function(d) {
        return d.name;
      });
  }

  destroy() {
    // NOOP
  }
}

export default ContributionOverTimeChart;
