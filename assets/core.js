$(document).ready(function(){
  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  //var color = d3.scaleOrdinal(d3.schemeCategory20);

  function getcolor(groupin){
    if(groupin=="healthy"){
      return "#66ff66"
    }else if(groupin=="obese"){
      return "#ffff66"
    }else if(groupin=="prediabetic"){
      return "#ffb366"
    }else if(groupin=="diabetic"){
      return "#ff6666"
    }else{
      return '#ffffff'
    }

  }
  var simulation;

  $("#socialmedia").click(function(){

    d3.selectAll("svg > *").remove();
    simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(function(d){return -600;}))
        .force("center", d3.forceCenter(width / 2, height / 2));
    d3.json("static/data.json", function(error, graph) {
      if (error) throw error;

      $('#gauge').html('');
      funky(Math.floor(Math.random() * 100) );

      var legend3 = svg.selectAll('.legend3')
          .data(['healthy','obese','prediabetic','diabetic'])
          .enter().append('g')
          .attr("class", "legends3")
          .attr("transform", function (d, i) {
          {
              return "translate(20," + (20 + (i * 24)) + ")"
          }
      })

      legend3.append('circle')
          .attr("r", 10)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", function (d, i) {
            return getcolor(d)
          })

      legend3.append('text')
          .attr("x", 20)
          .attr("y", 6)
      //.attr("dy", ".35em")
      .text(function (d, i) {
          return d
      })
          .attr("class", "textselected")
          .style("text-anchor", "start")
          .style("font-size", 15)





      var link = svg.append("g")
          .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
          .attr("stroke-width", function(d) { return d.value; });

      var node = svg.append("g")
          .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
          .attr("r", 24)
          .attr("fill", function(d) { return getcolor(d.group); })
          .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));

      var label = svg.append("g")
        .attr("class","labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter()
        .append("text")
        .text(function (d) { return d.id; })
        .style("text-anchor", "middle")
        .style("fill", "#555")
        .style("font-family", "Arial")
        .style("font-size", 10);

      node.append("title")
        .text(function(d) { return d.id; });

      simulation
          .nodes(graph.nodes)
          .on("tick", ticked);

      simulation.force("link")
          .links(graph.links);

      function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        label
            .attr("x", function(d){return d.x;})
            .attr("y", function(d){return d.y+5;})
      }
    });



   });

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }





});
