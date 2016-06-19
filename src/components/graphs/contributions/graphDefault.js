import d3 from 'd3';
import { reduceDuplicateMonths } from '../helpers/dataReducers'
import { formatDatesByMonth } from '../helpers/dataFormat'

class ChartDefault {
  constructor(el, state) {
    d3.select(el).select('.chart').append('svg')
    this.svg = d3.select(el).select('svg');
    this.type = 'default'

    if (state.data) {
      this.update(el, state);
    }
  }

  update(el, state) {
    let firstData = state.data,
        candidateNames = state.candidates;
    this._drawPoints(el, firstData, candidateNames);
  }

  _drawPoints(el,data, candidates) {

    this.svg.selectAll('*').remove();

    let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = el.offsetWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 100;

    for (let i of data) {
      i = reduceDuplicateMonths(i)
      i = formatDatesByMonth(i)
    }

    let mergedData = [].concat(...data)


    var x = d3.time.scale()
        .range([0, width - padding]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.amount); });


    let svg = this.svg
    .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(mergedData, function(d) { return d.date; }));
    y.domain(d3.extent(mergedData, function(d) { return d.amount; }));
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Contribution Amount ($)");

    let candidatePaths = svg.selectAll('.candidate')
      .data(mergedData)
      .enter().append('g')

    // using for in loop for index
    for (let i in data) {
      candidatePaths.append('path')
        .datum(data[i])
        .attr('class', 'line')
        .attr('d', line)

      candidatePaths.append('text')
        .text(candidates[i].candidateName)
        .attr('x', 3)
        .attr('dy', '.35em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(' + x(data[i][(data[i].length)-1].date) +',' + y(data[i][(data[i].length)-1].amount) + ')')
    }
  }
}

export default ChartDefault
