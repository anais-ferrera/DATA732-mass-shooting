var data = [
    {"platform": "Android","percentage": 30},
    {"platform": "Windows","percentage": 70},
];

var acolor = ["#1A5276","#9A7D0A"];

var svgWidth = 500, svgHeight = 300, radius = Math.min(svgWidth, svgHeight) /2;
var svg = d3.select('svg')
    .attr("width",svgWidth)
    .attr("height", svgHeight);

var g = svg.append("g")
    .attr("transform", "translate(" + radius + ", " + radius + ")");

//var color = d3.scale.ordinal()(d3.schemeCategory10);

var pie = d3.layout.pie().value(function(d){
    return d.percentage;
});

var path = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(0);

var arc = g.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g");


arc.append("path")
.attr("d",path)
.attr("fill", function(d, i){return acolor[i];});



// IMPORT DATA
//d3.dsv(';')("datasets/dataFinalUS.csv", function(data) {

//  let donut = new Donut(dWidth, dHeight, "#donut", "donutTooltip");
//  donut.generateDonut(colors, categories, data, true);
  //  var pie = d3.pie()
  //  console.log(pie(data))
//});
