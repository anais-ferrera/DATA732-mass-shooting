// params
let dWidth = 860;
let dHeight = 350;
let colors = ["#860A0A", "#0A7A7A"];

let categories = [
    { label: "Female", sub: ["F","Female","Male and Female"], count: 0 },
    { label: "Male", sub: ["M","Male and Female","Male"], count: 0 },
];


// load data from dataFinalUS
d3.csv("datasets/dataFinalUS.csv", function(data) {


    let donut = new Donut(dWidth, dHeight, "#donut", "donutTooltip");
    console.log(data);
	donut.generateDonut(colors, categories, data, true);
});

