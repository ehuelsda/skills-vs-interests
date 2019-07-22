var width = 800, height = 700;
var categories = ["language", "framework", "software", "other"];
var colors = ["palevioletred", "orange", "#5490d5", "lightgreen"];

var svg = d3.select("#my_plot")
.append("svg")
  .attr("width", width)
  .attr("height", height)
.append("g")
  .attr("transform", "translate(100,100)");

//X-axis
var x = d3.scaleLinear()
.domain([0,5])
.range([0,400])
svg.append("g").classed("axis",true)
.attr("transform", "translate(0,400)")
.style("font-size", ".9rem")
.style("stroke-width", 1.5)
.call(d3.axisBottom(x));
//X-axis title
svg.append("text")
.attr("text-anchor", "end")
.attr("x", width - 300)
.attr("y", height - 250)
.attr("fill", "#dadada")
.text("Ferdighet");

//Y-axis
var y = d3.scaleLinear()
.domain([0,5])
.range([400,0]);
svg.append("g").classed("axis", true)
.style("font-size", ".9rem")
.style("stroke-width", 1.5)
.call(d3.axisLeft(y));
//Y-axis title
svg.append("text")
.attr("text-anchor", "end")
.attr("transform", "rotate(-50)")
.attr("y", -50)
.attr("x", 0)
.attr("fill", "#dadada")
.text("Interesse");

svg.selectAll(".axis").select("path").style("stroke", "#dadada");
svg.selectAll(".axis").selectAll("line").style("stroke", "#dadada");
svg.selectAll(".axis").selectAll("text").style("fill", "#dadada");

//attribute color to categories
var color = d3.scaleOrdinal()
  .domain(categories)
  .range(colors);


/** Uncomment json and comment csv to use json file */

//d3.json("./skills.json").then(function(d){
d3.csv("./skills.csv").then(function(d){

  var nodes = d.map((node, index)=> {
    return {
      index: index,
      category: node.category,
      skill: node.skill,
      x: x(node.skill_level),
      y: y(node.interest_level),
      fill: color(node.category),
    };
  });
  
  //spread overlapping nodes
  var simulation = d3.forceSimulation(nodes)
  .force('collision', d3.forceCollide().radius(13))
  .stop()
  
  for (var i = 0; i <= nodes.length; ++i) {
    simulation.tick();
  }
  
  //append nodes to graph
  var node = svg.append("g").classed("nodes", true)
  .selectAll("dot")
  .data(nodes)
  .enter()
  
  node.append("circle")
  .attr("class", (d) => {
    return "node " + d.category
  })
  .attr("cx", (d) => {return d.x})
  .attr("cy", (d) => {return d.y})
  .attr("r", 15)
  .style("fill", (d)=>{return d.fill})
  .on("mouseover", function(d){
    svg.selectAll(".node").style("opacity", ".5")
    var category = d3.select(this).attr("class").split(" ")[1];
    d3.selectAll("." + category).style("opacity", "1");
  })
  .on("mouseleave",mouseleave);
  
  //add labels to nodes
  svg.append("g").classed("labels",true)
    .selectAll("dot")
    .data(nodes)
    .enter()
    .append("text")
      .text((d) => d.skill)
      .attr("class", (d) => {
        return d.category
      })
      .attr("x", (d) => {return d.x+20})
      .attr("y", (d) => {return d.y+5})
      .attr("fill", "#dadada")
});

 //add a legend
 var legend = svg.append("g").classed("legend", true)
 .selectAll("dot")
 .data(categories)
 .enter().append("g")
 .attr("transform", function(d, i) { return "translate(-110," + i * 40 + ")"; })
 .on("click", function(d){
 svg.selectAll(".node").style("opacity", ".5")
 d3.selectAll("." + d3.select(this).select("text").text()).style("opacity", "1");
 })
 .on("click", function(d){
 svg.selectAll(".node").style("opacity", ".5")
 d3.selectAll("." + d3.select(this).select("text").text()).style("opacity", "1");
 })
 .on("mouseleave", mouseleave);
 
 legend.append("circle")
 .attr("cx", width - 15)
 .attr("r", 15)
 .style("fill", color)
 
 legend.append("text")
 .attr("x", width - 40)
 .attr("y", 9)
 .attr("dy", "-.25em")
 .attr("fill", "#dadada")
 .style("text-anchor", "end")
 .text(function(d){return d;})
 
 d3.select(".legend").append("text").text("Klikk for å utheve kategori").attr("fill", "#dadada").attr("x", width-370).attr("y", -30);
 
 var mouseleave = function(){
 svg.selectAll(".node").style("opacity", "1")
 }
