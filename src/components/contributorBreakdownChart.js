import d3 from 'd3';

class ContributorBreakdownChart {
  constructor(el, state) {
    d3.select(el).select('.chart').append('svg');
    this.svg = d3.select(el).select('svg');
    this.type = 'contributorBreakdown';
    if (state.data) {
      this.update(el, state);
    }
  }

  update(el, state) {
    this._drawPoints(el, state.data);
  }

  _drawPoints(el, data) {
    data = [data];
    this.svg.selectAll('*').remove();
    let width = el.offsetWidth;
    let height = el.offsetHeight < 600 ? el.offsetHeight : 600;

    let margin = { top: 50, right: 100, bottom: 50, left: 100 };

    let x = d3.scale.ordinal().rangeRoundBands([0, width], 0.5);

    let y = d3.scale.linear().rangeRound([height, 0], 0.9);

    let color = d3.scale
      .ordinal()
      .range([
        '#98abc5',
        '#8a89a6',
        '#7b6888',
        '#6b486b',
        '#a05d56',
        '#d0743c',
        '#ff8c00'
      ]);

    let xAxis = d3.svg.axis().scale(x).orient('bottom');

    let yAxis = d3.svg
      .axis()
      .scale(y)
      .orient('left')
      .tickFormat(d3.format('.2s'));

    let svg = this.svg
      .attr('width', width)
      .attr(
        'height',
        height +
          margin.top +
          margin.bottom +
          20 * Object.keys(data[0].contributions).length -
          20
      )
      .style('padding-top', 20 * Object.keys(data[0].contributions).length)
      .style('padding-bottom', 20 * Object.keys(data[0].contributions).length)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    color.domain(
      d3.keys(data[0].contributions).filter(function(key) {
        return key;
      })
    );
    color.domain();

    data.forEach(function(d) {
      let y0 = 0;
      d.percents = color.domain().map(function(type) {
        return { type: type, y0: y0, y1: (y0 += +d['contributions'][type]) };
      });
      d.total = 100;
    });

    x.domain(
      data.map(function(d) {
        return d.name;
      })
    );
    y.domain([0, 100]);

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Percentage');

    let candidate = svg
      .selectAll('.candidate')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'g')
      .attr('transform', function(d) {
        return 'translate(' + x(d.name) + ',0)';
      });

    candidate
      .selectAll('rect')
      .data(function(d) {
        return d.percents;
      })
      .enter()
      .append('rect')
      .attr('width', x.rangeBand() - 15)
      .attr('y', function(d) {
        return y(d.y1);
      })
      .attr('height', function(d) {
        return y(d.y0) - y(d.y1);
      })
      .style('fill', function(d) {
        return color(d.type);
      });

    let legend = svg
      .selectAll('.legend')
      .data(color.domain().slice().reverse())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        return 'translate(30,' + (i * -20 - 20) + ')';
      });

    legend
      .append('rect')
      .attr('x', 551 - 188)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);

    legend
      .append('text')
      .attr('x', 551 - 194)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function(d) {
        return d;
      });
  }

  destroy() {
    // NOOP
  }
}

export default ContributorBreakdownChart;
