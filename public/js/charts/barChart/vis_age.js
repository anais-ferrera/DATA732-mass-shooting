// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// set the ranges
var x = d3.scale.ordinal()
      .rangeRoundBands([0, width],0.1);
var y = d3.scale.linear()
      .range([height, 0]);

var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  
var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);
      
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

//var div= d3.select("#ageChart").append("div");
// get the data
d3.csv("datasets/dataAge.csv", function(error, data) {
if (error) throw error;

// format the data
data.forEach(function(d) {
  //d.categorie = +d.categorie;
  d.value = +d.value;
});

// Scale the range of the data in the domains
x.domain(data.map(function(d) { return d.categorie; }));
y.domain([0, d3.max(data, function(d) { return d.value; })]);

// append the rectangles for the bar chart
// svg.selectAll(".bar")
//   .data(data)
// .enter().append("rect")
//   .attr("class", "bar")
//   .attr("x", function(d) { return x(d.categorie); })
//   .attr("width", x.rangeBand())
//   .attr("y", function(d) { return y(d.value); })
//   .attr("height", function(d) { return height - y(d.value); })
//   .attr("fill", "#69b3a2");

// // add the x Axis
// svg.append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(xAxis);

// // add the y Axis
// svg.append("g")
//   .call(yAxis);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.categorie); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

});

