// IMPORT DATA
//d3.dsv(';')("datasets/dataFinalUS.csv", function(data) {

//  let donut = new Donut(dWidth, dHeight, "#donut", "donutTooltip");
//  donut.generateDonut(colors, categories, data, true);
  //  var pie = d3.pie()
  //  console.log(pie(data))
//});



var width = 960,
    height = 500,
    // find the min of width and height and devided by 2
    radius = Math.min(width, height) / 2;

// Scales are functions that map from an input domain to an output range.  Ordinal scales have a discrete domain, such as a set of names or categories. 
// from: https://github.com/mbostock/d3/wiki/Ordinal-Scales
var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

// Constructs a new arc generator with the default innerRadius-, outerRadius-, startAngle- and endAngle-accessor functions.  
// from: https://github.com/mbostock/d3/wiki/SVG-Shapes#arc
var arc = d3.svg.arc()
    // the outer radius of the pie chart.
    .outerRadius(radius - 10)
    // the inner radius of the pie chart, set 0 for now
    .innerRadius(0);


// Constructs a new pie function
var pie = d3.layout.pie()
    // not sorting
    .sort(null)
    // set the pie chart value to population.
    .value(function(d) { return d.population; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("datasets/dataArme.csv", function(error, data) {

  // convert all population to integer
  data.forEach(function(d) {
    d.population = +d.population;
  });

  // append a group
  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  // append path, the pie for each legal
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.legal); });

  // add text
  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.legal; });

});