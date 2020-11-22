
/**
 * 
 */
class Donut {

	/**
	 * DONUT CONSTRUCTOR
	 * @param {*} width 
	 * @param {*} height 
	 * @param {*} svgID 
	 * @param {*} tooltipClass 
	 */
	constructor(width, height, svgID, tooltipClass) {
		// 
		this.width = width;
		this.height = height;
		this.radius = Math.min(width, height) / 2;
		this.svgID = svgID;
		this.tooltipID = tooltipClass;
		//
		this.svg;
		this.tooltip;
		this.arc;
		this.outerArc;
		this.key;
		this.pie;

		this.init();
	}


	/**
	 * Setup components for the donut
	 */
	init() {
		// SVG
		this.svg = d3.select(this.svgID)
			.attr("width", this.width)
			.attr("height", this.height)
			.append("g")
			.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

		// GROUPS
		this.svg.append("g").attr("class", "slices");
		this.svg.append("g").attr("class", "labels");
		this.svg.append("g").attr("class", "lines");

		// TOOLTIP
		this.tooltip = d3.select("body")
			.append("div")
			.attr("id", this.tooltipID)
			.attr("class", "donutTooltip")
			.style("opacity", 0);
	}


	/**
	 * 
	 * @param {*} key 
	 * @param {*} data 
	 */
	change(color, data) {

		// LOCAL VALUES
		let radius = this.radius;
		let tooltip = this.tooltip;
		let percentage = this.getPercentage;

		// ARCS
		let arc = d3.svg.arc()
			.outerRadius(radius * 0.8)
			.innerRadius(radius * 0.4);

		let outerArc = d3.svg.arc()
			.innerRadius(radius * 0.9)
			.outerRadius(radius * 0.9);

		// KEY
		let key = function (d) {
			return d.data.label;
		}

		// PIE
		let pie = d3.layout.pie()
			.sort(null)
			.value(function (d) {
				return d.count;
			});

		/* ------- PIE SLICES -------*/
		let slice = this.svg.select(".slices").selectAll("path.slice")
			.data(pie(data), key);

		slice.enter()
			.insert("path")
			.style("fill", function (d) { return color(d.data.label); })
			.attr("class", "slice")

			// ON SLICE MOUSEOVER
			.on("mouseover", function (d) {
				tooltip.transition()
					.duration(200)
					.style("opacity", 1);
				// SHOW PERCENTAGE
				let percentage = (d.endAngle - d.startAngle)/(2*Math.PI)*100; 
				tooltip.text(percentage + "%")
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
			})

			// ON SLICE MOUSEOUT
			.on("mouseout", function (d) {
				tooltip.transition()
					.duration(200)
					.style("opacity", 0);
			});


		slice.transition().duration(1000)
			.attrTween("d", function (d) {
				this._current = this._current || d;
				let interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function (t) {
					return arc(interpolate(t));
				};
			})


		/* ------- TEXT LABELS -------*/

		let text = this.svg.select(".labels").selectAll("text")
			.data(pie(data), key);

		text.enter()
			.append("text")
			.attr("dy", ".35em")
			.text(function (d) {
				return d.data.label;
			});
			
		function midAngle(d) {
			return d.startAngle + (d.endAngle - d.startAngle) / 2;
		}

		text.transition().duration(1000)
			.attrTween("transform", function (d) {
				this._current = this._current || d;
				let interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function (t) {
					let d2 = interpolate(t);
					let pos = outerArc.centroid(d2);
					pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
					return "translate(" + pos + ")";
				};
			})
			.styleTween("text-anchor", function (d) {
				this._current = this._current || d;
				let interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function (t) {
					let d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start" : "end";
				};
			});

		text.exit()
			.remove();

		/* ------- SLICE TO TEXT POLYLINES -------*/

		let polyline = this.svg.select(".lines").selectAll("polyline")
			.data(pie(data), key);

		polyline.enter()
			.append("polyline");

		polyline.transition().duration(1000)
			.attrTween("points", function (d) {
				this._current = this._current || d;
				let interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function (t) {
					let d2 = interpolate(t);
					let pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				};
			});

		polyline.exit()
			.remove();
	}


	/**
	 * Remove data element which have a count value equals to 0
	 * @param {*} data 
	 * @param {*} colors 
	 */
	format(data) {

		let local = JSON.parse(JSON.stringify(data));
		// REMOVE COUNTS VALUE EQUALS TO 0
		local.forEach(function (d) {
			if (d.count == 0) {
				local.splice(local.indexOf(d), 1);
			}
		});
		return local;
	}


	/**
	 * Return the labels of the chart
	 */
	getLabels(categories) {
		let labels = [];
		categories.forEach(function (c) {
			labels.push(c.label);
		})
		return labels;
	}


	/**
	 * Regroup data into a smaller number of categories
	 * @param {*} new_categories 
	 */
	reCategorize(categories, data) {

		let local = JSON.parse(JSON.stringify(data));
		let localCat = JSON.parse(JSON.stringify(categories));
		local.forEach(function (d) {
			let gender = d.gender;
			localCat.forEach(function (c) {
				if (c['sub'].includes(gender)) {
					c['count'] += 1;
				}
			});
		});
		return localCat;
	}


	/**
	 * Count occurences in data
	 * @param {Array<JSON>} data 
	 */
	countOccurences(categories, data) {

		let local = JSON.parse(JSON.stringify(data));
		let localCat = JSON.parse(JSON.stringify(categories));
		local.forEach(function (d) {
			let gender = d.gender;
			localCat.forEach(function (c) {
				if (c['label'] == gender) {
					c['count'] += 1;
				}
			});
		});
		return localCat;
	}


	/**
	 * 
	 * @param {*} scheme 
	 * @param {*} data 
	 */
	generateDonut(scheme, categories, data, doReduce = false) {

		// DONUT DATA
		let donutData = null;
		if (doReduce) {
			donutData = this.reCategorize(categories, data).sort(function (a, b) {
				return a.count - b.count;
			});
		} else {
			donutData = this.countOccurences(categories, data).sort(function (a, b) {
				return a.count - b.count;
			});
		}

		// FORMAT CHART ELEMENTS
		donutData = this.format(donutData, scheme);

		// LABELS
		let domain = this.getLabels(categories);

		// COLOR SCHEME
		let colors = d3.scale.ordinal()
			.domain(domain)
			.range(scheme);

		this.change(colors, donutData);
	}


	/**
	 * Clear and remove the chart
	 */
	clear() {
		// SVG
		this.svg.selectAll("g")
			.transition()
			.duration(100)
			.style("opacity", 0).remove();
		// TOOLTIP
		this.tooltip.transition()
			.duration(200)
			.style("opacity", 0).remove();
	}
}