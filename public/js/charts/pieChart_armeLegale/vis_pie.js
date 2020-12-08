var pwidth = 500,
    pheight = 250,
    // find the min of width and height and devided by 2
    pradius = Math.min(pwidth, pheight) / 2;

// color for the pie
var pcolor = d3.scale.ordinal()
    .range(["#586F2D", "#0A7A7A", "#848484"]);

// Arc
var arc = d3.svg.arc()
    // the outer radius of the pie chart
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
              div1.html(d3.format(".4r")(+d.data.pourcentage)+"%")
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
      .style("fill","white")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.legal; });
      

});
