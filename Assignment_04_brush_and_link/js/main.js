// Color mapping based on year
var yearColors = {2000: '#8c8c8c', 2010: '#d86763'};
var valueColors = ['#fcc9b5','#fa8873','#d44951','#843540'];

var svg = d3.select('svg');
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');
var padding = {t: 40, r: 40, b: 40, l: 40};
var cellPadding = 10;
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

function SplomCell(x, col,color,attribute, cattr, type) {
    this.xScale = x;
    this.col = col;
    this.colorScale = color;
    this.attribute = attribute;
    this.colorAttr = cattr;
    this.type = type;
}


var cells = [];

var yScaleDot = d3.scaleLinear().range([600, 100]).domain([0,140]);

var yScaleBar = d3.scaleLinear().range([250, 50]).domain([0,54]);

var brushCell;

var extentByAttribute = {};

var xScale = d3.scaleLinear().range([0, 300]);





var brush = d3.brushX()
    .extent([[0,0],[300, 600]])
    .on("start", brushstart)
    .on("brush", brushmove)
    .on("end", brushend);
function brushstart(cell) {
    // cell is the SplomCell object

    // Check if this g element is different than the previous brush
    if(brushCell !== this) {

        // Clear the old brush
        brush.move(d3.select(brushCell), null);
       

        // Update the global scales for the subsequent brushmove events
        xScale.domain(extentByAttribute[cell.attribute]);
        
        // Save the state of this g element as having an active brush
        brushCell = this;
    }
}

function brushmove(cell) {
    // cell is the SplomCell object

    // Get the extent or bounding box of the brush event, this is a 2x2 array
    var e = d3.event.selection;
    if(e) {

        // Select all .dot circles, and add the "hidden" class if the data for that circle
        // lies outside of the brush-filter applied for this SplomCells x and y attributes
        // console.log(
        // console.log(cell.attribute);
        svg.selectAll(".dot")
            .classed("hidden", function(d){
                // console.log(d)
                var temp = e[0] > xScale(d[cell.attribute]) || xScale(d[cell.attribute]) > e[1];
                
                return temp;
                // return e[0][0] > xScale(d[cell.attribute]) || xScale(d[cell.attribute]) > e[1][0];
            })
    }
}

function brushend() {
    // If there is no longer an extent or bounding box then the brush has been removed
    if(!d3.event.selection) {
        // Bring back all hidden .dot elements
        svg.selectAll('.hidden').classed('hidden', false);
        // Return the state of the active brushCell to be undefined
        brushCell = undefined;
    }
}

function mouseOn(cell){
    var e = d3.event.target;
    var str = e.getAttribute("class");
    var currClass = str.substr(str.indexOf(' ')+1);

    svg.selectAll(".bar")
            .classed("hidden", function(d){
                 
                var temp = !(currClass == d.key);
                
                return temp;
                // return e[0][0] > xScale(d[cell.attribute]) || xScale(d[cell.attribute]) > e[1][0];
            })
    svg.selectAll(".dot")
            .classed("hidden", function(d){
                 
                var temp = !(currClass == d.country);
                
                return temp;
                // return e[0][0] > xScale(d[cell.attribute]) || xScale(d[cell.attribute]) > e[1][0];
            })

}

function mouseOut(cell){
    svg.selectAll('.hidden').classed('hidden', false);
}

// Dataset from http://nbremer.github.io/urbanization/
d3.csv('./data/asia_urbanization.csv',
function(row){
    // This callback formats each row of the data
    return {
        city: row.city,
        country: row.country,
        type_country: row.type_country,
        land_2000: +row.land_2000,
        land_2010: +row.land_2010,
        land_growth: +row.land_growth,
        pop_2000: +row.pop_2000,
        pop_2010: +row.pop_2010,
        pop_growth: +row.pop_growth,
        density_2000: +row.density_2000,
        density_2010: +row.density_2010,
        density_growth: +row.density_growth
    }
},
function(error, dataset){
    if(error) {
        console.error('Error while loading ./data/asia_urbanization.csv dataset.');
        console.error(error);
        return;
    }

    // **** Your JavaScript code goes here ****


    var histWidth = 300;

    var barWidth = 200;




    var DensityGrowthExtent = d3.extent(dataset, function(d) { return d.density_growth; });

    var PopGrowthExtent = d3.extent(dataset, function(d) { return d.pop_growth; });

    var LandGrowthExtent = d3.extent(dataset, function(d) { return d.land_growth; });

    extentByAttribute['density_growth'] = DensityGrowthExtent;
    extentByAttribute['pop_growth'] = PopGrowthExtent;
    extentByAttribute['land_growth'] = LandGrowthExtent;

    var x1Scale = d3.scaleLinear().range([0, histWidth]).domain(DensityGrowthExtent);

    var x2Scale = d3.scaleLinear().range([0, histWidth]).domain(PopGrowthExtent);

    var x3Scale = d3.scaleLinear().range([0, histWidth]).domain(LandGrowthExtent);

    // color scale for bottom graph

    var Density2010Extent = d3.extent(dataset, function(d) { return d.density_2010; });

    var Pop2010Extent = d3.extent(dataset, function(d) { return d.pop_2010; });

    var Land2010Extent = d3.extent(dataset, function(d) { return d.land_2010; });


    // var valueColor1Scale = d3.scaleQuantize().range(valueColors).domain(Density2010Extent

    // var valueColor2Scale = d3.scaleQuantize().range(valueColors).domain(Pop2010Extent);

    // var valueColor3Scale = d3.scaleQuantize().range(valueColors).domain(Land2010Extent);

    var valueColor1Scale = d3.scaleThreshold().range(valueColors).domain([5000, 10000, 15000]);
    var valueColor2Scale = d3.scaleThreshold().range(valueColors).domain([2*1000*1000, 3*1000*1000, 4*1000*1000]);
    var valueColor3Scale = d3.scaleThreshold().range(valueColors).domain([400, 600, 800]);

    var groupDataIntoBins1 = d3.histogram()
                            .value(function(d) { return d.density_growth; }) // tell d3 to group data by grades
                            .domain(x1Scale.domain()) // only include data within [61, 99], anything outside will be ignored 
                            .thresholds(x1Scale.ticks(80));

    var groupDataIntoBins2 = d3.histogram()
                            .value(function(d) { return d.pop_growth; }) // tell d3 to group data by grades
                            .domain(x2Scale.domain()) // only include data within [61, 99], anything outside will be ignored 
                            .thresholds(x2Scale.ticks(80));

    var groupDataIntoBins3 = d3.histogram()
                            .value(function(d) { return d.land_growth; }) // tell d3 to group data by grades
                            .domain(x3Scale.domain()) // only include data within [61, 99], anything outside will be ignored 
                            .thresholds(x3Scale.ticks(80));

    var groupedDensityGrowth = groupDataIntoBins1(dataset); 

    var groupedPopGrowth = groupDataIntoBins2(dataset); 

    var groupedLandGrowth = groupDataIntoBins3(dataset); 

    for (var i = 0; i < groupedDensityGrowth.length; i++){

        groupedDensityGrowth[i].sort(function(a, b){return b.density_2010 - a.density_2010});

    }


    for (var i = 0; i < groupedPopGrowth.length; i++){

        groupedPopGrowth[i].sort(function(a, b){return b.pop_2010 - a.pop_2010});

    }

    for (var i = 0; i < groupedLandGrowth.length; i++){

        groupedLandGrowth[i].sort(function(a, b){return b.land_2010 - a.land_2010});

    }

    cells.push(new SplomCell(x1Scale, 1, valueColor1Scale, 'density_growth','density_2010','hist'));

    cells.push(new SplomCell(x2Scale, 2, valueColor2Scale, 'pop_growth', 'pop_2010','hist'));

    cells.push(new SplomCell(x3Scale, 3, valueColor3Scale, 'land_growth', 'land_2010','hist'));



    // bar data
    var nested = d3.nest()
    .key(function(c) {
        // Returns 'Technology', 'Food & Drink', or 'Airlines'
        return c.country;
    })
    .rollup(function(leaves) {
        

        var totalLand2000 = d3.sum(leaves, function(c){
            return c.land_2000;
        });

        var totalLand2010 = d3.sum(leaves, function(c){
            return c.land_2010;
        });

        var totalPop2000 = d3.sum(leaves, function(c){
            return c.pop_2000;
        });

        var totalPop2010 = d3.sum(leaves, function(c){
            return c.pop_2010;
        });

        var totalDensity2000 = d3.mean(leaves, function(c){
            return c.density_2000;
        });

        var totalDensity2010 = d3.mean(leaves, function(c){
            return c.density_2010;
        });

        return {totalDensity2000: totalDensity2000, totalDensity2010: totalDensity2010, totalLand2000: totalLand2000, totalLand2010: totalLand2010, totalPop2000: totalPop2000, totalPop2010: totalPop2010};
    })
    .entries(dataset); // entries returns a key-value array





    var PopDensity = nested.slice();
    PopDensity.sort(function(a, b){return a.value.totalDensity2010 - b.value.totalDensity2010});


    var Land = nested.slice();
    Land.sort(function(a, b){return a.value.totalLand2010 - b.value.totalLand2010});


    var Pop = nested.slice();
    Pop.sort(function(a, b){return a.value.totalPop2010 - b.value.totalPop2010});



    // var DensityExtent = d3.extent(PopDensity, function(d) { return d.value.totalDensity2010; });

    // var PopExtent = d3.extent(Pop, function(d) { return d.value.totalPop2010; });

    // var LandExtent = d3.extent(Land, function(d) { return d.value.totalLand2010; });

    var DesityMax = d3.max(PopDensity, function(d) { return d.value.totalDensity2010; });
    var DesityMin = d3.min(PopDensity, function(d) { return d.value.totalDensity2000; });

    var PopMax = d3.max(Pop, function(d) { return d.value.totalPop2010; });
    var PopMin = d3.min(Pop, function(d) { return d.value.totalPop2000; });

    var LandMax = d3.max(Land, function(d) { return d.value.totalLand2010; });
    var LandMin = d3.min(Land, function(d) { return d.value.totalLand2000; });


    var bar1Scale = d3.scaleLinear().range([0, barWidth]).domain([DesityMin, DesityMax]);

    var bar2Scale = d3.scaleLinear().range([0, barWidth]).domain([PopMin, PopMax]);

    var bar3Scale = d3.scaleLinear().range([0, barWidth]).domain([LandMin, LandMax]);



    cells.push(new SplomCell(bar1Scale, 1, valueColor3Scale, 'totalDensity2000', 'totalDensity2010','bar'));
    cells.push(new SplomCell(bar2Scale, 2, valueColor3Scale, 'totalPop2000', 'totalPop2010','bar'));
    cells.push(new SplomCell(bar3Scale, 3, valueColor3Scale, 'totalLand2000', 'totalLand2010','bar'));






    // cell releated

    SplomCell.prototype.init = function(g) {
    var cell = d3.select(g);

    if (this.type == 'bar'){
        cell.append('rect')
          .attr('class', 'frame')
          .attr('width', 310)
          .attr('height', 300)
          .style('fill', '#f06')
          .style('fill-opacity', '0.0')
          .style('stroke', '#000')
          .style('stroke-width', '1')
          .attr('transform', 'translate(-90,0)');

        cell.append('g') // Append a g element for the scale
       .attr('class', 'x axis') // Use a class to css style the axes together
       .attr('transform', 'translate(0,250)') // Position the axis
       .call(d3.axisBottom(this.xScale).ticks(5).tickFormat(d => d/1000 + "k"));


       var graphName3 = cell.append('text')
        .attr('class', 'legend')
        .attr('transform', 'translate(70, 30)')
        .style("font-size","13px")
        .text('Avg. population density (in persons/sq.km)')
         .style("text-anchor","middle")

        if (this.attribute == 'totalPop2000'){
            graphName3.text('Urban population')

        }

        if (this.attribute == 'totalPop2000'){
            graphName3.text('Urban land (in sq.km)')

        }
    }
    else{
        cell.append('g') // Append a g element for the scale
       .attr('class', 'x axis') // Use a class to css style the axes together
       .attr('transform', 'translate(0,600)') // Position the axis
       .call(d3.axisBottom(this.xScale).tickFormat(d => d*100 + "%"));

       cell.append('g') // Append a g element for the scale
       .attr('class', 'x axis') // Use a class to css style the axes together
       .attr('transform', 'translate(0,0)') // Position the axis
       .call(d3.axisLeft(yScaleDot));

       cell.append('text')
        .attr('class', 'x axis-label')
        .attr('transform', 'translate(-25, 580)rotate(270)')
        .text('Number of cities');


        cell.append('rect')
        .attr('class', 'legend')
          .attr('width', 10)
          .attr('height', 10)
          .style('fill', '#fcc9b5')
          .attr('transform', 'translate(200,500)')

        var text1 = cell.append('text')
        .attr('class', 'legend')
        .attr('transform', 'translate(220, 510)')
        .text('<2M');

        cell.append('rect')
        .attr('class', 'legend')
          .attr('width', 10)
          .attr('height', 10)
          .style('fill', '#fa8873')
          .attr('transform', 'translate(200,480)')

        var text2 = cell.append('text')
        .attr('class', 'legend')
        .attr('transform', 'translate(220, 490)')
        .text('2M - 3M');

        cell.append('rect')
        .attr('class', 'legend')
          .attr('width', 10)
          .attr('height', 10)
          .style('fill', '#d44951')
          .attr('transform', 'translate(200,460)')

        var text3 = cell.append('text')
        .attr('class', 'legend')
        .attr('transform', 'translate(220, 470)')
        .text('3M - 4M');

        cell.append('rect')
        .attr('class', 'legend')
          .attr('width', 10)
          .attr('height', 10)
          .style('fill', '#843540')
          .attr('transform', 'translate(200,440)')

        var text4= cell.append('text')
        .attr('class', 'legend')
        .attr('transform', 'translate(220, 450)')
        .text('> 4M');

        var text5= cell.append('text')
        .attr('class', 'legend')
        .attr('transform', 'translate(200, 420)')
        .text('Urban population - 2010');

        var graphName1 = cell.append('text')
        .attr('class', 'legend')
        .attr('transform', 'translate(170, 350)')
        .style("font-size","13px")

        graphName1.text('Growth in population')

        var graphName2 = cell.append('text')
        .attr('class', 'legend')
        .attr('transform', 'translate(170, 370)')
        .style("font-size","13px")

        graphName2.text('between 2000 and 2010')

        if (this.attribute == 'density_growth'){
            text1.text('< 5k')
            text2.text('5k - 10k')
            text3.text('10k - 15k')
            text4.text('> 15k')
            text5.text('Urban density - 2010')
            graphName1.text('Growth in avg. population density')

        }

        if (this.attribute == 'land_growth'){
            text1.text('< 0.4k')
            text2.text('0.4k - 0.6k')
            text3.text('0.6k - 0.8k')
            text4.text('> 0.8k')
            text5.text('Urban land - 2010')
            graphName1.text('Growth in urban land')

        }
    }


    }

    SplomCell.prototype.update = function(g, data) {
    var cell = d3.select(g);

    // Update the global x,yScale objects for this cell's x,y attribute domains

    // Save a reference of this SplomCell, to use within anon function scopes
    var _this = this;

    if (this.type == 'hist'){
        var dots = cell.selectAll('cell')
            .data(data);

        var dotsEnter = dots.enter()
            .append('circle')
            .attr('class', 'dot')
            .style("fill", function(d) { 
                return _this.colorScale(d[_this.colorAttr]); })
            .attr('r', 2);


        dots.merge(dotsEnter).attr('cx', function(d){
                return _this.xScale(data.x0);
            })
            .attr('cy', function(d, i){
                return yScaleDot(i);
            });

        dots.exit().remove();
    }
    else{
        var bars2010 = cell.selectAll('cell')
            .data(data);
        var bars2010Enter = bars2010.enter()
            .append("rect")
            // .attr('class', 'bar')
            .attr('class', function(d){
                return 'bar'+' '+d.key;
            })
            .style("fill", function(d,i) { 
                return yearColors[2010]; })
            .attr("transform", function(d,i) { 
                var ty = yScaleBar(3*i+1)
                
                return "translate(" + 0 + "," + ty + ")"; });


            bars2010Enter
            .on('mouseover', mouseOn)
            .on('mouseout', mouseOut);

            bars2010.merge(bars2010Enter).attr("x", 1)
            .attr("height", 3)
            .attr("width", function(d) { return _this.xScale(d.value[_this.colorAttr]); });

            bars2010.exit().remove();





            var bars2000 = cell.selectAll('cell')
            .data(data);


            var bars2000Enter = bars2000.enter()
            .append("rect")
            // .attr('class', 'bar')
            .attr('class', function(d){
                return 'bar'+' '+d.key;
            })
            .style("fill", function(d,i) { 
                return yearColors[2000]; })
            .attr("transform", function(d,i) { 
                var ty = yScaleBar(3*i)
                return "translate(" + 0 + "," + ty + ")"; });

            bars2000Enter
            .on('mouseover', mouseOn)
            .on('mouseout', mouseOut);

            bars2000.merge(bars2000Enter).attr("x", 1)
            .attr("height", 3)
            .attr("width", function(d) { 
                
                return _this.xScale(d.value[_this.attribute]); });

            bars2000.exit().remove();

            
            var countryName = cell.selectAll('cell')
            .data(data);

            var countryNameEnter = bars2000.enter()
            .append("text")
            .attr('class', 'bar')
            .style("fill", function(d,i) { 
                return yearColors[2000]; })
            .style("font-size","10px")
            .style("text-anchor","end")
            .attr("transform", function(d,i) { 
                var ty = yScaleBar(3*i)
                return "translate(" + (-5) + "," + ty + ")"; });

            countryName.merge(countryNameEnter).text(function(d) { return d.key; });

            countryName.exit().remove();




    }
}
    



    var cellEnter1 = chartG.selectAll('.cell')
    .data(cells.slice(0,3))
    .enter()
    .append('g')
    .attr('class', 'cell')
    .attr("transform", function(d, i ) {
        // Start from the far right for columns to get a better looking chart
        var tx = 400*i+ 100;
         var ty = 0;

        if (d.type == 'bar'){
            tx = 400* (i-3) +230;
        }
        
       
        return "translate("+[tx, ty]+")";
     });


   
    
    cellEnter1.append('g')
    .attr('class', 'brush')
    .call(brush);



    cellEnter1.each(function(cell){
        cell.init(this);
        if(cell.type == 'hist'){
            if (cell.attribute == 'density_growth'){
                for (var i = 0; i < groupedDensityGrowth.length; i++){
                    cell.update(this, groupedDensityGrowth[i]);
                }
            }  

            if (cell.attribute == 'pop_growth'){
                for (var i = 0; i < groupedPopGrowth.length; i++){
                    cell.update(this, groupedPopGrowth[i]);
                }
            }   

            if (cell.attribute == 'land_growth'){
                for (var i = 0; i < groupedLandGrowth.length; i++){
                    cell.update(this, groupedLandGrowth[i]);
                }
            }
        }
        else{
            if(cell.attribute == 'totalDensity2000'){
                cell.update(this,PopDensity)
            }

            if(cell.attribute == 'totalPop2000'){
                cell.update(this,Pop)
            }

            if(cell.attribute == 'totalLand2000'){
                cell.update(this,Land)
            }
        }  
        
    });


    // var cell2 = cells.slice(3,6)
    // console.log(cell2)

    var cellEnter2 = chartG.selectAll('.cell')
    .data(cells)
    .enter()
    .append('g')
    .attr('class', 'cell')
    .attr("transform", function(d, i ) {
        // Start from the far right for columns to get a better looking chart
        var tx = 400*i+ 230;
         var ty = 0;

        if (d.type == 'bar'){
            tx = 400* (i-3) +230;
        }
        
       
        return "translate("+[tx, ty]+")";
     });


   




    cellEnter2.each(function(cell){
        cell.init(this);
        if(cell.type == 'hist'){
            if (cell.attribute == 'density_growth'){
                for (var i = 0; i < groupedDensityGrowth.length; i++){
                    cell.update(this, groupedDensityGrowth[i]);
                }
            }  

            if (cell.attribute == 'pop_growth'){
                for (var i = 0; i < groupedPopGrowth.length; i++){
                    cell.update(this, groupedPopGrowth[i]);
                }
            }   

            if (cell.attribute == 'land_growth'){
                for (var i = 0; i < groupedLandGrowth.length; i++){
                    cell.update(this, groupedLandGrowth[i]);
                }
            }
        }
        else{
            if(cell.attribute == 'totalDensity2000'){
                cell.update(this,PopDensity)
            }

            if(cell.attribute == 'totalPop2000'){
                cell.update(this,Pop)
            }

            if(cell.attribute == 'totalLand2000'){
                cell.update(this,Land)
            }
        }  
        
    });





});


