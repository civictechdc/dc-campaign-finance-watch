'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContributorDendogramChart = function () {
    function ContributorDendogramChart(el, state) {
        _classCallCheck(this, ContributorDendogramChart);

        _d2.default.select(el).select('.chart').append('svg');
        this.svg = _d2.default.select(el).select('svg');
        this.type = 'contributorDendogram';
        if (state.data) {
            this.update(el, state);
        }
    }

    _createClass(ContributorDendogramChart, [{
        key: 'update',
        value: function update(el, state) {
            this._drawPoints(el, state.data);
        }
    }, {
        key: '_drawPoints',
        value: function _drawPoints(el, data) {
            var self = this;
            var i = 0,
                duration = 750;
            this.svg.selectAll('*').remove();
            var width = el.offsetWidth;
            var height = el.offsetHeight < 600 ? el.offsetHeight : 600;

            var margin = { top: 50, right: 100, bottom: 50, left: 100 };

            var tree = _d2.default.layout.tree().size([height, width]);

            var diagonal = _d2.default.svg.diagonal().projection(function (d) {
                return [d.y, d.x];
            });

            var svg = this.svg.attr("width", width).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var root = data[0];
            root.x0 = height / 2;
            root.y0 = 0;

            function collapse(d) {
                if (d.children) {
                    d._children = d.children;
                    d._children.forEach(collapse);
                    d.children = null;
                }
            }

            root.children.forEach(collapse);
            update(root);
            _d2.default.select(self.frameElement).style("height", "800px");

            function update(source) {
                var nodes = tree.nodes(root).reverse(),
                    links = tree.links(nodes);

                nodes.forEach(function (d) {
                    d.y = d.depth * 180;
                });

                // Update the nodes…
                var node = svg.selectAll("g.node").data(nodes, function (d) {
                    return d.id || (d.id = ++i);
                });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("g").attr("class", "node").attr("transform", function (d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                }).on("click", click);

                nodeEnter.append("circle").attr("r", 1e-6).style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

                nodeEnter.append("text").attr("x", function (d) {
                    return d.children || d._children ? -10 : 10;
                }).attr("dy", ".35em").attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                }).text(function (d) {
                    return d.name;
                }).style("fill-opacity", 1e-6);

                // Transition nodes to their new position.
                var nodeUpdate = node.transition().duration(duration).attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

                nodeUpdate.select("circle").attr("r", 4.5).style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

                nodeUpdate.select("text").style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition().duration(duration).attr("transform", function (d) {
                    return "translate(" + source.y + "," + source.x + ")";
                }).remove();

                nodeExit.select("circle").attr("r", 1e-6);

                nodeExit.select("text").style("fill-opacity", 1e-6);

                // Update the links…
                var link = svg.selectAll("path.link").data(links, function (d) {
                    return d.target.id;
                });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g").attr("class", "link").attr("d", function (d) {
                    var o = { x: source.x0, y: source.y0 };
                    return diagonal({ source: o, target: o });
                });

                // Transition links to their new position.
                link.transition().duration(duration).attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition().duration(duration).attr("d", function (d) {
                    var o = { x: source.x, y: source.y };
                    return diagonal({ source: o, target: o });
                }).remove();

                // Stash the old positions for transition.
                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });

                // Toggle children on click.
                function click(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    update(d);
                }
            }
        }
    }]);

    return ContributorDendogramChart;
}();

exports.default = ContributorDendogramChart;