import d3 from 'd3';

class ContributionByWardChart {
    constructor(el, state) {
        d3.select(el).select('.chart').append('svg');
        this.svg = d3.select(el).select('svg');
        this.type = 'contributionByWardChart';
        if(state.data) {
          this.update(el, state);
        }
    }

    update(el, state) {
        this._drawPoints(el, state.data);
    }

    _drawPoints(el, data) {
        console.log(data);
        this.svg.selectAll('*').remove();
        var margin = { top: 50, right: 0, bottom: 100, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        gridSize = Math.floor(width / 24),
        legendElementWidth = gridSize*2,
        buckets = 9,
        //TODO: better colors?
        //colors = ['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641'],
        colors = /*["#ffffd9","#edf8b1","#c7e9b4",*/ ["#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], 
        contributions = data.contributions,
        //TODO: the key currently uses the CampaignId which doesn't mean much by itself
        campaigns = data.campaigns,
        wards = ["OSDC", "W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

        var svg = this.svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var campaignLabels = svg.selectAll(".campaignLabel")
            .data(campaigns)
            .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "campaignLabel mono axis axis-workweek" : "campaignLabel mono axis"); });

        var wardLabels = svg.selectAll(".wardLabel")
            .data(wards)
            .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "wardLabel mono axis axis-worktime" : "wardLabel mono axis"); });
                
        var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(contributions, function (d) { 
            return d.amount; 
        })])
        .range(colors);

        var cards = svg.selectAll(".card")
            .data(contributions, function(d) {
            	var ward = d.ward.split(" ")[1];
            	var coords = (campaigns.indexOf(d.campaignId))+":"+(!isNaN(ward)?ward:0);
               console.log(coords);
               return coords; 
            });

        cards.append("title");

        cards.enter().append("rect")
            .attr("x", function(d) {
                var ward = d.ward.split(" ")[1];
                return (!isNaN(ward)?ward:0) * gridSize;
            })
            .attr("y", function(d) { 
                return (campaigns.indexOf(d.campaignId)) * gridSize })
            .attr("rx", 4) // border radius
            .attr("ry", 4)
            .attr("class", "card bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0]);

        cards.transition().duration(1000)
            .style("fill", function(d) { return colorScale(d.amount); });

        cards.select("title").text(function(d) { return d.amount; });
        
        cards.exit().remove();

        var legend = svg.selectAll(".legend") //legend data bound here....
            .data([0].concat(colorScale.quantiles()), function(d) { return d; });

        legend.enter().append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

        legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize);

        legend.exit().remove();
  
    }
}

export default ContributionByWardChart;
