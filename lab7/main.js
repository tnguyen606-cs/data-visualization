// # ***** Chart MAP **** # //
var svgMap = d3.select('svg');

var path = d3.geoPath();

var gMap = svgMap.append("g");

var formatComma = d3.format(',');

var selectValue = '';

// # **** SCATTER - CHART 2 ***** //
var svgWidth = 500;
var svgHeight = 500;

var chart2 = d3.select('#scatterPlot').append("svg")
    .attr('id', 'svgMap')
    .style('border', '1px solid #777')
    .attr("width",svgWidth).attr("height",svgHeight);

var padding = {t: 20, r: 20, b: 20, l: 20};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

//chart2.attr('transform', 'translate('+[padding.l + 600, 0]+')');

// Create a group element for appending chart elements
var chartG = chart2.append('g')
    .attr('class', 'g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// Create x and y scales
var xScale = d3.scaleLinear().range([0, chartWidth]);
var yScale = d3.scaleLinear().range([chartHeight - 20, 0]);
var r_plot_Scale = d3.scaleSqrt().range([0, 10]);
var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

// Create groups for the x- and y-axes
var xAxisG = chartG.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate('+[20, chartHeight]+')');
var yAxisG = chartG.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate('+[20, 0]+')');

// ****** Activity 3: Advanced Tooltips **** //
var toolTip = d3.tip()
    .attr("class", "d3-tip")
    // offset a tooltip relative to its calculated position: from [top, left]
    .offset([-12, 0]) 
    // set the tip's HTML content
    .html(function(d) {
        return "<h5>"+d['Name']+"</h5><table><thead><tr><td colspan='2'>ACT Median</td><td>Admission Rate</td><td>Average Cost</td><td>Mean Earnings</td></tr></thead>"
                 + "<tbody><tr><td colspan='2'>"+d['ACT Median']+"</td><<td>"+d['Admission Rate']+"</td><td>"+d['Avg Cost']+"</td><td>"+d['Mean Earnings 8 years After Entry']+"</td></tr></tbody>"
                 + "<thead><tr><td colspan='2'>Undergrad Population</td><td>Retention Rate</td><td>Median Debt</td><td>Control</td></tr></thead>"
                 + "<tbody><tr><td colspan='2'>"+d['Undergrad Population']+"</td><td>"+d['Retention Rate (First Time Students)']+"</td><td>"+d['Median Debt']+"</td><td>"+d['Control']+"</td></tr></tbody></table>"
    });
    chart2.call(toolTip);


var currX, currY;
var newData;

////////////////////////////////////// LOAD - DATA //////////////////////////////////////////////////
d3.csv("colleges.csv", function (csv) {

  //Create a global data variable
  undergrad = csv; 

  // Create global object called chartScales to keep state 
  updateChart('Retention Rate (First Time Students)', 'Average Cost', csv);



    /* #Region MAP */
    d3.json("topo.json", function (json) {

    var regions = topojson.feature(json, json.objects.regions).features

    console.log("Print regions ARRAY");
    console.log(regions);


    var populationByRegion = d3.nest()
      .key(function (d) { return d.Region; })
      .rollup(function (v) { return d3.sum(v, function (d) { return d['Undergrad Population']; }); })
      .entries(csv);

    var region, regionName, population;

    // * Copy the data value into the JSON
    for (num in populationByRegion) {
      region = populationByRegion[num];
      ////// 
      console.log(region);
      regionName = region['key'];
      population = region['value'];

      for (var i = 0; i < regions.length; i++) {
        var usReg = json.objects.regions.geometries[i].name;
        if (regionName == usReg) {
          console.log(usReg)
          // Copy the data value into the JSON
          regions[i].properties.population = population;
          regions[i].properties.regionName = regionName;
          // Stop looking through the JSON
          break;   // Bail
        }
    }  }
    

    ////////////////////////// Draw the Map ////////////////////////////////

    // #region
    var color = d3.scaleLinear()
      .domain([310575, 1893765]) 
      .range(["white", "#008b89"]);

    var div = d3.select("#chart1")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
    
    gMap.selectAll("path")
      .attr("class", "regions")
      .data(regions)
      .enter()
      .append("path")
      .attr("d", path)
      .attr('fill', function (d) {
        return color(d.properties.population);
      })
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .8)
          .text(formatComma(d.properties.population))
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })              
      .on("mouseout", function (d) {       
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("click", function(d) {
        d3.select('.selectedRegion').classed('selectedRegion', false);
        d3.select(this).classed('selectedRegion', true);
        selectValue = d.properties.regionName; 
        newData = undergrad.filter(function(d) { return d.Region == selectValue; });
        // if (newData.length != 0) {
        //   updateChart(currX, currY, newData);
        // }
      });         

    svgMap.append("path")
      .attr("class", "region-borders")
      .attr("d", path(topojson.mesh(json, json.objects.regions, function (a, b) { 
        return a !== b; 
    })));


    ////////////////////////// Draw the Gradient ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    //Color Legend container
    var gradientSvg = svgMap.append("g")
      .attr("transform", "translate(580,20)");

    //Append title
    gradientSvg.append("text")
      .attr("class", "legendTitle")
      .attr("x", 0)
      .attr("y", -4)
      .text("Undergraduate Population (100,000's)");

    //Append a defs (for definition) element to your SVG
    var defs = svgMap.append("defs");

    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient");

    linearGradient.selectAll("stop")
      .data(color.range())
      .enter()
      .append("stop")
      .attr("offset", function (d, i) { return i / (color.range().length - 1); })
      .attr("stop-color", function (d) { return d; });

    //Draw the rectangle and fill with gradient
    gradientSvg.append("rect")
      .attr("width", 300)
      .attr("height", 20)
      .style("fill", "url(#linear-gradient)");

    var colorScale = d3.scaleLinear()
      .domain([310575, 1893765])
      .range([0, 300]);

    //Define x-axis
    xAxis = d3.axisBottom(colorScale)
      .tickFormat(function (d) {
        return d / 100000;
      });

    gradientSvg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (20) + ")")
      .call(xAxis);

    ////////////////////////// Labels /////////////////////////////////////////


    var labels = svgMap.append("g").attr("class", "label-group");
    labels.selectAll(".label")
      .data(regions)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", function (d) {
        return path.centroid(d)[0];
      })
      .attr("y", function (d) {
        return path.centroid(d)[1];
      })
      .text(function (d) {
          return d.properties.regionName;
      });

  
  });

});

function updateChart(chartScalesX, chartScalesY, datum) {

  currX = chartScalesX;
  currY = chartScalesY;

    // **** Draw and Update your chart here ****

    // Update the scale domain on updateChart
    xScale.domain(d3.extent(datum, function(d){return +d[chartScalesX];}));
    yScale.domain(d3.extent(datum, function(d){return +d[chartScalesY];}));
    r_plot_Scale.domain(d3.extent(datum, function(d){return +d['Admission Rate'];}));

    // Update the axes based on updated x and y scales
    xAxisG.call(d3.axisBottom(xScale).ticks(6).tickSize(-chartHeight, 0, 0))
    .selectAll("text")
    .attr("transform", "rotate(-90)");
    yAxisG.call(d3.axisLeft(yScale).ticks(6).tickSize(-chartWidth, 0, 0));

    // Enter + Update to create the circles
    var dots = chartG.selectAll('.dot')
    .data(datum, function(d){
        return d['Name']+'-'+d['Admission Rate']; // Create a unique id for the car
    });

    var dotsEnter = dots.enter()
    .append('g')
    .attr('class', 'dot')
    .attr('transform', function(d) {
        var tx = xScale(d[chartScalesX]);
        var ty = yScale(d[chartScalesY]);
        return 'translate('+[tx, ty]+')';
    });

    dotsEnter.append('circle')
    .attr('r', function(d) { return r_plot_Scale(+d['Admission Rate']); })
    .style("fill", function(d) { return colorScale(+d[chartScalesX]); });

    dots.attr('transform', function(d) {
        var tx = xScale(d[chartScalesX]);
        var ty = yScale(d[chartScalesY]);
        return 'translate('+[tx, ty]+')';
    });

     // Create mouse hover listeners //
    // show up on mouseover (start hovering), hide on mouseout (end hovering). //
    dotsEnter
    .on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

    // Merge Enter + Update selection +  Adding Transitions
    dots.merge(dotsEnter)
    .transition()
    .duration(800)
    .attr('transform', function(d) {
        var tx = xScale(d[chartScalesX]);
        var ty = yScale(d[chartScalesY]);
        return 'translate('+[tx + 20, ty]+')';
    });

    xAxisG
    .transition()
    .duration(800)
    .call(d3.axisBottom(xScale).ticks(10).tickSize(-chartHeight, 0, 0))
    .selectAll("text")
    .attr("transform", "rotate(-90)");
    yAxisG
    .transition()
    .duration(800)
    .call(d3.axisLeft(yScale).ticks(10).tickSize(-chartWidth, 0, 0));

}

function onScaleChanged() {
    var selectX = d3.select('#xSelect').node();
    var selectY = d3.select('#ySelect').node();
    //var selectR = d3.select('#regionSelect').node();

    // Get current value of select element
    var categoryX = selectX.options[selectX.selectedIndex].value;
    var categoryY = selectY.options[selectY.selectedIndex].value;

    // Update chart with the selected category
    updateChart(categoryX, categoryY, undergrad);

}
