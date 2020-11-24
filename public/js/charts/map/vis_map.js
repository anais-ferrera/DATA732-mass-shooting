//Width and height of map
var width = 1060;
var height = 600;
var centered;


//Create SVG5 element and append map to the SVG5
var svg5 = d3.select("#map")
	.attr("width", width)
	.attr("height", height)
	.append("g");

// Append Div for tooltip to SVG5
var div = d3.select("body")
	.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0)


// APPEND INFORMATIONS FIELDS IN THE TOOLTIP

// VICTIMS
let tooltipVictims = div.append("div")
	.attr("id", "victims");

tooltipVictims.append("div")
   .attr("id", "killed");

tooltipVictims.append("div")
   .attr("id", "injured");

// DRAWING LINE
let tooltipLine = div.append("hr")
	.attr("id", "separator");

// CONTEXT
let tootipcontext = div.append("div")
	.attr("id", "context");

tootipcontext.append("div")
   .attr("id", "title");

tootipcontext.append("div")
   .attr("id", "date");

// SUMMARY
div.append("div")
   .attr("id", "description");

// D3 Projection
var projection = d3.geo.albersUsa()
	.translate([width / 2, height / 2])    
	.scale([1000]);          

// Define path generator
// path generator --> converts GeoJSON to SVG5 paths
var path = d3.geo.path()               
	.projection(projection);  


// Define linear scale for output
var color = d3.scale.linear()
	.range(["#E79696", "#C96B6B", "#AC4141", "#8E1616"]);

var legendText = ["150+", "100-150", "50-100", "0-50"];



// Load data to have state of dataFinalUS
d3.csv("datasets/dataFinalUS.csv", function (data) {
	var expensesCount = d3.nest()
		.key(function (data) { return data.state; })
		.rollup(function (v) {
			return {
				total_victims: d3.sum(v, function (e) { return e.total_victims; }),
				r: reducevalue(d3.sum(v, function (e) { return e.total_victims; }))
			};
		}).entries(data);
	// Associate color to domain
	color.domain([0, 1, 2, 3]); 

	// Load GeoJSON data and merge with states data
	d3.json("datasets/us-states.json", function (json) {

		// Loop through each state data value in the .csv file
		for (var i = 0; i < expensesCount.length; i++) {

			// Get the name of state
			var dataState = expensesCount[i].key;

			// Get data value 
			var dataValue = expensesCount[i].values.r;

			// Find the corresponding state inside the GeoJSON
			for (var j = 0; j < json.features.length; j++) {
				var jsonState = json.features[j].properties.name;

				if (dataState == jsonState) {

					// Copy the data value into the JSON
                    json.features[j].properties.r = dataValue;
                    
					break;
				}
			}
			
		}

		// Bind the data to the SVG5 and create one path per GeoJSON feature
		svg5.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
				.attr("d", path)
				.style("stroke", "#fff")
				.style("stroke-width", "1")
				.style("fill", function (d) {
					// Get data value
					var value = d.properties.r;
					if (value) {
						return color(value);
					} else {
						return color(0);
					}
				})

			// mouseover
			.on("mouseover", function (d) {

			})

			// double click
			.on("dblclick", double_clicked);


		// aoom in map
		function double_clicked(d) {
			var x, y, k;
			
			if (d && centered !== d) {
				var centroid = path.centroid(d);
				x = centroid[0];
				y = centroid[1];
				k = 4;
				centered = d;
			} else {
				x = width / 2;
				y = height / 2;
				k = 1;
				centered = null;
			}
			
			svg5.selectAll("path")
				.classed("active", centered && function(d) { return d === centered; });
			
			svg5.transition()
				.duration(750)
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
				.style("stroke-width", 1.5 / k + "px");
			}


		d3.csv("datasets/dataFinalUS.csv", function (data) {
            // circle on the map to show case
			svg5.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return projection([d.longitude, d.latitude])[0];
				})
				.attr("cy", function (d) {
					return projection([d.longitude, d.latitude])[1];
                })
                // size of the circle changes with the number of total_victims
				.attr("r", function (d) {
					return Math.sqrt(d.total_victims) * 2;
				})
				.style("fill", "#420505")
				.style("opacity", 0.85)
                
                // mouseover
				.on("mouseover", function (d) {
					div.transition()
						.duration(200)
						.style("opacity", 1)
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
					d3.select("#killed")
					  .html("<b><font color=\"red\">" + Math.floor(d.fatalities) + "</font></b>" + " killed");

					d3.select("#injured")
					  .html("<b><font color=\"red\">" + Math.floor(d.injured) + "</font></b>" + " injured");

					d3.select("#title")
						.text(d.case);

					d3.select("#date")
						.text(d.date);

					d3.select("#description")
						.text(d.summary);

				})

				// mouseout               
				.on("mouseout", function (d) {
					div.transition()
						.duration(500)
						.style("opacity", 0);
				});
		});

		var legend = d3.select("#legend")
			.attr("class", "legend")
			.attr("width", 140)
			.attr("height", 200)
			.selectAll("g")
			.data(color.domain().slice().reverse())
			.enter()
			.append("g")
			.attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);

		legend.append("text")
			.data(legendText)
			.attr("x", 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.text(function (d) { return d; });
	});

});