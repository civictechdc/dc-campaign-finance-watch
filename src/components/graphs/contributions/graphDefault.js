import d3 from 'd3';
import styles from './style.css'


class ChartDefault {
  constructor(el, state) {
    console.log("appending svg")
    d3.select(el).select('.chart').append('svg')
    this.svg = d3.select(el).select('svg');
    this.type = 'default'

    if (state.data) {
      this.update(el, state);
    }
  }

  update(el, state) {
    // mutate data.
    console.log(state.data)
    let firstData = state.data[0]

    this._drawPoints(el, firstData);
  }

  _drawPoints(el,data) {
    let formatDate = d3.time.format("%Y-%m-%d")
    //mutating dates.
    for (let k of data) {
      let digits = k.date.match(/^\d+|\d+\b|\d+(?=\w)/g).slice(0,3);
      k.date = digits[0]+'-'+digits[1]+'-'+digits[2]
      k.date = formatDate.parse(k.date);
      k.amount = +k.amount;
      // append same dates and add amounts.
    }
    console.log(data[0])
    console.log("drawing points!")
    this.svg.selectAll('*').remove();

    let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = el.offsetWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


    var x = d3.time.scale()
        .range([0, width]);

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
    // Grab the min and max contribution dates
    x.domain(d3.extent(data, function(d) { return d.date; }));
y.domain(d3.extent(data, function(d) { return d.amount; }));
//
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

    let candidates = svg.selectAll('.candidate')
      .data(data)
      .enter().append('g')

    candidates.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr("d", line)

// svg.append("path")
//     .datum(data)
//     .attr("class", line)
//     .attr("d", line);

  }
}

export default ChartDefault
