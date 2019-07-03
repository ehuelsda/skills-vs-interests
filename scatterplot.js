var width = 700, height = 700;
var categories = ["language", "framework", "software", "other"];
var colors = ["blue", "purple", "pink", "darkblue"];

var svg = d3.select("#my_plot")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(100,100)");


  //X-axis
  var x = d3.scaleLinear()
    .domain([0,5])
    .range([0,400]);
  svg.append("g")
    .attr("transform", "translate(0,400)")
    .style("font-size", ".9rem")
    .call(d3.axisBottom(x));
  //X-axis title
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width - 300)
    .attr("y", height - 250)
    .text("Skill");

  //Y-axis
  var y = d3.scaleLinear()
    .domain([0,5])
    .range([400,0]);
  svg.append("g")
    .style("font-size", ".9rem")
    .call(d3.axisLeft(y));

  //Y-axis title
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-50)")
    .attr("y", -50)
    .attr("x", 0)
    .text("Interest");

d3.csv('skills.csv', function(data) {

  //attribute color to categories
  var color = d3.scaleOrdinal()
    .domain(categories)
    .range(colors);

  // Tooltip
  var tooltip = d3.select("#my_plot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("font-family", "sans-serif")
    .style("display", "inline-block")
    .style("position", "absolute");

    var mouseover = function(data) {
      tooltip
        .style("opacity", 1)
        .html(data.skill)
        .style("left", (d3.mouse(this)[0])+150 + "px")
        .style("top", (d3.mouse(this)[1])+75 + "px")
    };

    var mouseleave = function(data) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }

  svg.append('g')
    .selectAll("dot")
    .data([data])
    .enter()
    .append("circle")
      .attr("cx", x(data.skill_level))
      .attr("cy", y(data.interest_level)+10)
      .attr("r", 10)
      .style("fill", function(data){ return color(data.category)})
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
})

svg.append("text")
.attr("text-anchor", "end")
.attr("transform", "rotate(-50)")
.attr("y", 350)
.attr("x", width)
.text("Test");



