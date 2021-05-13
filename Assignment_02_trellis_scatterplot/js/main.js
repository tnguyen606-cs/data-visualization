
// **** Your JavaScript code goes here ****
d3.csv('./data/real_estate.csv', function(error, data){

var nested = d3.nest()
  .key(function(d) { return d.location; })

  .entries(data);






  

var svg = d3.select('svg');

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');
var padding = {t: 20, r: 20, b: 60, l: 60};

trellisWidth = svgWidth / 2 - padding.l - padding.r;
trellisHeight = svgHeight / 2 - padding.t - padding.b;

	var trellisG = svg.selectAll('.trellis')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'trellis')
    .attr('transform', function(d, i){
       //use similar code as has been used for the background rectangles
       
       var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
        var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
        return 'translate('+[tx, ty]+')';
     })


    var xScale = d3.scaleLinear()
    .domain([1875,2016])
    .range([0, trellisWidth]);

    var yScale = d3.scaleLinear()
    .domain([0,5000])
    .range([trellisHeight, 0]);


   


    trellisG.selectAll('circle')
    .data(function(d){
    	
        return d.values;
    })
    .enter()
    .append('circle')
    .attr("cx", function (d) { 
    	return xScale(d.year_built); })
    .attr("cy", function (d) { return yScale(d.price_per_sqft); })
    .attr("r", 3)
    .style("fill", function(d){
    	if(d.beds <=2){
    		return "#499936";
    	}
    	else{
    		return "#2e5d90";
    	}
    });

    var xAxis = d3.axisBottom(xScale).ticks(7);
trellisG.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,'+trellisHeight+')')
    .call(xAxis);

var yAxis = d3.axisLeft(yScale);
trellisG.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(0,0)')
    .call(yAxis);

    trellisG.append('text')
    .attr('class', 'x axis-label')
    .attr('transform', 'translate('+[-20+trellisWidth / 2, trellisHeight + 34]+')')
    .text('Year Built');

	trellisG.append('text')
    .attr('class', 'y axis-label')
    .attr('transform', 'translate('+[-45, 90+trellisHeight / 2]+') rotate(270)')
    .text('Price per Square Foot (USD)');

    trellisG.append('text')
    .text(function(d){
    	return d.key;
    })
    .attr('transform', 'translate('+[-20+trellisWidth / 2, +34]+')');

});