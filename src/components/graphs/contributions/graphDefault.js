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
    let firstData = state.data[1]

    this._drawPoints(el, firstData);
  }

  reduceDuplicateDates(data) {
    let prevDate = ''
    let prev = 0
    for (let i = 1; i < data.length; i++) {
      if (data[i].date == data[prev].date) {
        data[i].amount += data[prev].amount
        data.splice(prev, 1)
        i-=1
        prev = i
      } else {
        prev = i
      }
    }
    return data
  }

  reduceDuplicateMonths(data) {
    let prevMonth = 0
    let prevIdx = 0
    // for first element, extract month.
    for (let i = 0; i < data.length; i++) {
      let curMonth = data[i].date.match(/^\d+|\d+\b|\d+(?=\w)/g).slice(0,3)[1];
      if (i == 0) {
        prevMonth = curMonth
        continue
      }
      // check if month is duplicate.
      if (curMonth == prevMonth) {
        data[i].amount += data[prevIdx].amount
        data.splice(prevIdx, 1)
        i-=1
        prevIdx = i
      } else {
        prevMonth = curMonth
        prevIdx = i
      }
    }
    return data
  }

  formatDates(data) {
    let formatDate = d3.time.format("%Y-%m-%d")

    for (let k of data) {
      let digits = k.date.match(/^\d+|\d+\b|\d+(?=\w)/g).slice(0,3);
      k.date = digits[0]+'-'+digits[1]+'-'+digits[2]
      k.date = formatDate.parse(k.date);
      k.amount = +k.amount;
    }
    return data
  }

  formatDateByMonth(data) {
    let formatDate = d3.time.format("%Y-%m-%d")

    for (let k of data) {
      let digits = k.date.match(/^\d+|\d+\b|\d+(?=\w)/g).slice(0,3);
      k.date = digits[0]+'-'+digits[1]+'-01'
      k.date = formatDate.parse(k.date);
      k.amount = +k.amount;
    }
    return data
  }

  _drawPoints(el,data) {

    // reducing duplicate dates.
    data = this.reduceDuplicateMonths(data)
    console.log(data)
    data = this.formatDateByMonth(data)




    console.log("drawing points!")
    this.svg.selectAll('*').remove();

    let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = el.offsetWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 50;


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

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.amount; }));

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

    candidates.append('text')
        .text(data[0].campaignCommitteeName)
        .attr('x', 3)
        .attr('dy', '.35em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(' + x(data[(data.length)-1].date) +',' + y(data[(data.length)-1].amount) + ')')
  }
}

export default ChartDefault
