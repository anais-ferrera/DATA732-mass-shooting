// PARAMS
let dWidth = 860;
let dHeight = 350;
let colors = ["#7B241C", "#1A5276"];

let categories = [
    { label: "Female", sub: ["F","Female","Male and Female"], count: 0 },
    { label: "Male", sub: ["M","Male and Female","Male"], count: 0 },
];


// IMPORT DATA
d3.dsv(';')("datasets/dataFinalUS.csv", function(data) {


	let donut = new Donut(dWidth, dHeight, "#donut", "donutTooltip");
	donut.generateDonut(colors, categories, data, true);
});

