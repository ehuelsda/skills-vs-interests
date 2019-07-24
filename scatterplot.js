// Sizing
const svgWidth = 800, svgHeight = 700, plotHeight = 400, plotWidth = 400
const radius = 15

// Colouring
const colors = ["palevioletred", "orange", "#5490d5", "lightgreen"]
const textColor = "#e0e0e0"
const plotColor = "#e0e0e0"

// Content
const categories = ["language", "framework", "software", "other"] //must match the used categories in skills.json
const xAxisTitle = "Skill"
const yAxisTitle = "Interest"
const legendHeading = "Click to highlight category"


/** Create SVG */
var svg = d3.select("#my_plot")
.append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
.append("g")
  .attr("transform", "translate(100,100)")

/** X-Axis */
var x = d3.scaleLinear()
  .domain([0,5])
  .range([0,plotWidth])
svg.append("g").classed("axis",true)
  .attr("transform", "translate(0,"+plotHeight+")")
  .style("font-size", ".9rem")
  .style("stroke-width", 1.5)
  .call(d3.axisBottom(x))

// add title
svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", plotWidth + 50)
  .attr("y", plotHeight + 50)
  .attr("fill", textColor)
  .text(xAxisTitle)

/** Y-Axis */
var y = d3.scaleLinear()
  .domain([0,5])
  .range([plotHeight,0]);
svg.append("g").classed("axis", true)
  .style("font-size", ".9rem")
  .style("stroke-width", 1.5)
  .call(d3.axisLeft(y));

//add title
svg.append("text")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-50)")
  .attr("y", -50)
  .attr("x", 0)
  .attr("fill", textColor)
  .text(yAxisTitle)

//styling
svg.selectAll(".axis").select("path").style("stroke", plotColor);
svg.selectAll(".axis").selectAll("line").style("stroke", plotColor);
svg.selectAll(".axis").selectAll("text").style("fill", plotColor);

/** Attribute color to categories */
var color = d3.scaleOrdinal()
  .domain(categories)
  .range(colors);


/** Create plot 
 * 
 * Uncomment json and comment csv to use json file
*/
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
  
  var mouseleave = function(){
    svg.selectAll(".node").style("opacity", "1")
  } 

  //append nodes to graph
  var node = svg.append("g").classed("nodes", true)
    .selectAll("dot")
    .data(nodes)
    .enter()
  
  node.append("circle")
    .attr("class", (d) => {
      //category must be placed first for mouseover function to work
      return d.category + " node"
    })
    .attr("cx", (d) => {return d.x})
    .attr("cy", (d) => {return d.y})
    .attr("r", radius)
    .style("fill", (d)=>{return d.fill})
    .on("mouseover", function(d){
      svg.selectAll(".node").style("opacity", ".5")
      var category = d3.select(this).attr("class").split(" ")[0];
      d3.selectAll("." + category).style("opacity", "1");
    })
    .on("mouseleave", mouseleave);
  
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
      .attr("x", (d) => {return d.x + radius + 5})
      .attr("y", (d) => {return d.y + (radius/2)})
      .attr("fill", textColor)

  //add a legend
  var legend = svg.append("g").classed("legend", true)
    .selectAll("dot")
    .data(categories)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(-110," + i * 40 + ")"; })

    //highlight clicked category
    .on("click", function(d){
      svg.selectAll(".node").style("opacity", ".5")
      d3.selectAll("." + d3.select(this).select("text").text()).style("opacity", "1");
    })
  
  legend.append("circle")
    .attr("cx", svgWidth - radius)
    .attr("r", radius)
    .style("fill", color)
  
  legend.append("text")
    .attr("x", svgWidth - radius - 30)
    .attr("y", (radius/2))
    .attr("dy", "-.25em")
    .attr("fill", textColor)
    .style("text-anchor", "end")
    .text(function(d){return d;})
  
  //add heading to legend
  d3.select(".legend").append("text").text(legendHeading).attr("fill", textColor).attr("x", svgWidth-300).attr("y", -30);
  
  
})