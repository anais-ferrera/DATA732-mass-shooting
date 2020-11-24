var pwidth = 960,
    pheight = 500,
    // find the min of width and height and devided by 2
    pradius = Math.min(pwidth, pheight) / 2;

// Scales are functions that map from an input domain to an output range.  Ordinal scales have a discrete domain, such as a set of names or categories. 
// from: https://github.com/mbostock/d3/wiki/Ordinal-Scales
var pcolor = d3.scale.ordinal()
    .range(["#E84A27", "#E7E009", "#ABAB9D"]);

// Constructs a new arc generator with the default innerRadius-, outerRadius-, startAngle- and endAngle-accessor functions.  
// from: https://github.com/mbostock/d3/wiki/SVG-Shapes#arc
var arc = d3.svg.arc()
    // the outer radius of the pie chart.
    .outerRadius(pradius - 10)
    // the inner radius of the pie chart, set 0 for now
    .innerRadius(0);


// Constructs a new pie function
var pie = d3.layout.pie()
    // not sorting
    .sort(null)
    // set the pie chart value to population.
    .value(function(d) { return d.population; });

var svg = d3.select("#pie_chart").append("svg")
    .attr("width", pwidth)
    .attr("height", pheight)
    .append("g")
    .attr("transform", "translate(" + pwidth / 2 + "," + pheight / 2 + ")");
var div1= d3.select("body").append("div")
    .attr("class", "tooltip")         
    .style("opacity", 0);
d3.csv("datasets/dataArme.csv", function(error, data) {

  // convert all population to integer
  data.forEach(function(d) {
    d.population = +d.population;
  });

  // append a group
  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc")
      .on("mouseover",function(d){
        div1.transition()
              .duration(200)
              .style("opacity",.9);
        div1.html("Nb : "+d.data.population)
              .style("left",(d3.event.pageX +10)+"px")
              .style("top",(d3.event.pageY -50)+"px");
    })
        .on("mouseout",function(d){
            div1.transition()
              .duration(500)
              .style("opacity",0);
        });

  // append path, the pie for each legal
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return pcolor(d.data.legal); });

  // add text
  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.legal; });

});
