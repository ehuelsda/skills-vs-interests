var width = 800, height = 700;
var categories = ["language", "framework", "software", "other"];
var colors = ["rgba(255,155,255,.5)", "rgba(255,100,0,.5)", "rgba(200,25,25,.5)", "rgba(80,255,90,.5)"];

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
  svg.append("g")
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
    .text("Skill");

  //Y-axis
  var y = d3.scaleLinear()
    .domain([0,5])
    .range([400,0]);
  svg.append("g")
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
    .text("Interest");

d3.csv('skills.csv', function(data) {

  //attribute color to categories
  var color = d3.scaleOrdinal()
    .domain(categories)
    .range(colors);

  var xVar = "skill_level",
      yVar = "interest_level";



    var simulation = d3.forceSimulation([data])
    .force('collision', d3.forceCollide().radius(10))
    .stop()

    
          
    for (var i = 0; i < 150; ++i) {
      simulation.tick();
    }


    svg.append('g')
    .selectAll("dot")
    .data([data])
    .enter()
    .append("circle")
      .attr("cx", x(data[xVar]))
      .attr("cy", y(data[yVar])+10)
      .attr("r", 10)
      .style("stroke", "#dadada")
      .style("stroke-width",  2)
      .style("fill", function(data){ return color(data.category)})



    svg.selectAll("labels")
      .data([data])
      .enter()
      .append("text")
        .text(data.skill)
        .attr("x", x(data[xVar]) + 20)
        .attr("y", y(data[yVar]) + 20)
        .attr("fill", "#dadada")
        .attr("class", "labels")

        var legend = svg.selectAll(".legend")
        .data(categories)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(-110," + i * 30 + ")"; });

        legend.append("circle")
          .attr("cx", width - 10)
          .attr("r", 10)
          .style("fill", color)
          .style("stroke", "#dadada")
          .style("stroke-width",  2)
         

        legend.append("text")
          .attr("x", width - 30)
          .attr("y", 9)
          .attr("dy", "-.15em")
          .attr("fill", "#dadada")
          .style("text-anchor", "end")
          .text(function(d){return d;});

})
