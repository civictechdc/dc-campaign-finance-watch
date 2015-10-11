import d3 from 'd3';

class ContributorBreakdownChart {
  constructor(el, state) {
    d3.select(el).select('.chart').append('svg');
    this.svg = d3.select(el).select('svg');
    this.type = 'contributorBreakdown';
    if(state.data) {
      this.update(el, state);
    }
  }

  update(el, state) {
    this._drawPoints(el, state.data);
  }

  // let data = []
  //   {name: 'Cand1', individual: '45', corporate: '25', other: '30'},
  //   {name: 'Cand2', individual: '25', corporate: '45', other: '30'},
  //   {name: 'Cand3', individual: '45', corporate: '30', other: '25'}
  // ];

  _drawPoints(el, data) {
    this.svg.selectAll('*').remove();
    let width = el.offsetWidth;
    let height = el.offsetHeight < 600 ? el.offsetHeight : 600;

    let margin = {top: 50, right: 100, bottom: 50, left: 100};

    let x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .5);

    let y = d3.scale.linear()
      .rangeRound([height, 0], .9);

    let color = d3.scale.ordinal()
      .range(['#98abc5', '#8a89a6', '#7b6888']);

    let xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    let yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

    let svg = this.svg
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(d3.keys(data[0]).filter(function(key){ return key !== 'name' }));

    data.forEach(function(d){
      let y0 = 0;
      console.log(d);
      d.percents = color.domain().map(function(type){ return { type: type, y0: y0, y1: y0 += +d[type] }; });
      d.total = 100;
    });

    x.domain(data.map(function(d){ return d.name; }));
    y.domain([0, 100]);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Percentage');

    let candidate = svg.selectAll('.candidate')
      .data(data)
      .enter().append('g')
      .attr('class', 'g')
      .attr('transform', function(d){ return 'translate(' + x(d.name) + ',0)'});

    candidate.selectAll('rect')
      .data(function(d){ return d.percents; })
      .enter().append('rect')
      .attr('width', x.rangeBand()-15)
      .attr('y', function(d){ return y(d.y1); })
      .attr('height', function(d){ return y(d.y0) - y(d.y1); })
      .style('fill', function(d){ return color(d.type); });

    let legend = svg.selectAll('.legend')
      .data(color.domain().slice().reverse())
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i){ return 'translate(-' + i * 100 + ',-20)'; });

    legend.append("rect")
      .attr("x", width - 188)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend.append("text")
      .attr("x", width - 194)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
  }


  destroy(el) {
    // NOOP
  }
}

export default ContributorBreakdownChart;
