var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 40, r: 40, b: 40, l: 40};
var cellPadding = 10;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

var dataAttributes = ['economy (mpg)', 'cylinders', 'power (hp)', '0-60 mph (s)'];
var N = dataAttributes.length;

// Compute chart dimensions
var cellWidth = (svgWidth - padding.l - padding.r) / N;
var cellHeight = (svgHeight - padding.t - padding.b) / N;

var xScale = d3.scaleLinear().range([0, cellWidth - cellPadding]);
var yScale = d3.scaleLinear().range([cellHeight - cellPadding, 0]);

var xAxis = d3.axisTop(xScale).ticks(6).tickSize(-cellHeight * N, 0, 0);
var yAxis = d3.axisLeft(yScale).ticks(6).tickSize(-cellWidth * N, 0, 0);

var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

var extentByAttribute = {};
var brushCell;

    // Create a brush object that spans the cells' dimensions
    var brush = d3.brush()
        .extent([[0, 0], [cellWidth - cellPadding, cellHeight - cellPadding]])
        .on("start", brushstart)
        .on("brush", brushmove)
        .on("end", brushend);

    // Create a d3-tooltip object and inject in html
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-12, 0])
        .html(function(d) {
            // Inject html, when creating your html I recommend editing the html within your index.html first
            return "<h5>"+d['name']+"</h5><table><thead><tr><td>0-60 mph (s)</td><td>Power (hp)</td><td>Cylinders</td><td>Year</td></tr></thead>"
                 + "<tbody><tr><td>"+d['0-60 mph (s)']+"</td><td>"+d['power (hp)']+"</td><td>"+d['cylinders']+"</td><td>"+d['year']+"</td></tr></tbody>"
                 + "<thead><tr><td>Economy (mpg)</td><td colspan='2'>Displacement (cc)</td><td>Weight (lb)</td></tr></thead>"
                 + "<tbody><tr><td>"+d['economy (mpg)']+"</td><td colspan='2'>"+d['displacement (cc)']+"</td><td>"+d['weight (lb)']+"</td></tr></tbody></table>"
        });

    // Initialize tooltip on the svg, this adds the tooltip div to the <body> element
    svg.call(toolTip);


// ****** Add reusable components here ****** //
function SplomCell(x, y, col, row) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.row = row;
}

// SplomCell.init - initialize this cell with it's group element
SplomCell.prototype.init = function(g) {
    var cell = d3.select(g);

    // Create frame rectangle
    cell.append('rect')
      .attr('class', 'frame')
      .attr('width', cellWidth - cellPadding)
      .attr('height', cellHeight - cellPadding);
}

// SplomCell.update - initialize the cell with it's group element and new data
SplomCell.prototype.update = function(g, data) {
    var cell = d3.select(g);

    // Update the global x,yScale objects for this cell's x,y attribute domains
    xScale.domain(extentByAttribute[this.x]);
    yScale.domain(extentByAttribute[this.y]);

    // Save a reference of this SplomCell, to use within anon function scopes
    var _this = this;

    // Standard Enter, Update, Exit based on the incoming data
    // This cane be called later on to filter data
    var dots = cell.selectAll('.dot')
        .data(data, function(d){
            return d.name +'-'+d.year+'-'+d.cylinders; // Create a unique id for the car
        });

    var dotsEnter = dots.enter()
        .append('circle')
        .attr('class', 'dot')
        .style("fill", function(d) { return colorScale(d.cylinders); })
        .attr('r', 4);

    dotsEnter
        .on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide);

    // Challenge 2: Link on hover
    // dotsEnter
    //     .on('mouseover', function(d) {
    //         svg.selectAll('.dot').classed('hovered', function(dotData){
    //             return dotData === d;
    //         });
    //         toolTip.show.apply(this, [d]);
    //     })
    //     .on('mouseout', function(d) {
    //         svg.selectAll('.hovered').classed('hovered', false);
    //         toolTip.hide.apply(this, [d]);
    //     });

    dots.merge(dotsEnter).attr('cx', function(d){
            return xScale(d[_this.x]);
        })
        .attr('cy', function(d){
            return yScale(d[_this.y]);
        });

    dots.exit().remove();
}

d3.csv('./cars.csv',
    // Load data and use this function to process each row
    function(row) {
        return {
            'name': row['name'],
            'economy (mpg)': +row['economy (mpg)'],
            'cylinders': +row['cylinders'],
            'displacement (cc)': +row['displacement (cc)'],
            'power (hp)': +row['power (hp)'],
            'weight (lb)': +row['weight (lb)'],
            '0-60 mph (s)': +row['0-60 mph (s)'],
            'year': +row['year']
        };
    },
    function(error, dataset) {
        // Log and return from an error
        if(error) {
            console.error('Error while loading ./cars.csv dataset.');
            console.error(error);
            return;
        }

        cars = dataset;

        // Create a map for the extents of each data column we will use in the Splom
        dataAttributes.forEach(function(attribute){
            extentByAttribute[attribute] = d3.extent(dataset, function(d){
                return d[attribute];
            });
        });

        // Initialize a cross grid of x- and y-gridlines, add this first so it shows up below the cells
        chartG.selectAll('.x.axis')
            .data(dataAttributes)
            .enter()
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', function(d,i) {
                return 'translate('+[(N - i - 1) * cellWidth + cellPadding / 2, 0]+')';
            })
            .each(function(attribute){
                xScale.domain(extentByAttribute[attribute]);
                d3.select(this).call(xAxis);
                d3.select(this).append('text')
                    .text(attribute)
                    .attr('class', 'axis-label')
                    .attr('transform', 'translate('+[cellWidth / 2, -20]+')');
            });
        chartG.selectAll('.y.axis')
            .data(dataAttributes)
            .enter()
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', function(d,i) {
                return 'translate('+[0, i * cellHeight + cellPadding / 2]+')';
            })
            .each(function(attribute){
                yScale.domain(extentByAttribute[attribute]);
                d3.select(this).call(yAxis);
                d3.select(this).append('text')
                    .text(attribute)
                    .attr('class', 'axis-label')
                    .attr('transform', 'translate('+[-26, cellHeight / 2]+')rotate(270)');
            });

        // Create a list of SplomCells that contain info on the data attribute types for x- and y-scales of that cell
        var cells = [];
        dataAttributes.forEach(function(attrX, col){
            dataAttributes.forEach(function(attrY, row){
                cells.push(new SplomCell(attrX, attrY, col, row));
            });
        });

        // Create the cells using an enter selection
        var cellEnter = chartG.selectAll('.cell')
            .data(cells)
            .enter()
            .append('g')
            .attr('class', 'cell')
            .attr('transform', function(d) {
                // Start from the far right for columns to get a better looking chart
                var tx = (N - d.col - 1) * cellWidth + cellPadding / 2;
                var ty = d.row * cellHeight + cellPadding / 2;
                return 'translate('+[tx, ty]+')';
            });

        // Add a brush element to all the cells
        cellEnter.append('g')
            .call(brush);

        // Use .each() to iterate through all cells and init() and upate() them to draw initial data
        cellEnter.each(function(c){
            c.init(this);
            c.update(this, dataset);
        });
    });


function brushstart(cell) {
    // cell is the SplomCell object

    // Check if this g element is different than the previous brush
    if(brushCell !== this) {

        // Clear the old brush
        brush.move(d3.select(brushCell), null);

        // Update the global scales for the subsequent brushmove events
        xScale.domain(extentByAttribute[cell.x]);
        yScale.domain(extentByAttribute[cell.y]);

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
        svg.selectAll(".dot")
            .classed("hidden", function(d){
                return e[0][0] > xScale(d[cell.x]) || xScale(d[cell.x]) > e[1][0]
                    || e[0][1] > yScale(d[cell.y]) || yScale(d[cell.y]) > e[1][1];
            });

        // Challenge 1: FILTER ON BRUSH
        // xScale.domain(extentByAttribute[cell.x]);
        // yScale.domain(extentByAttribute[cell.y]);

        // var filtered = cars.filter(function(d){
        //     return (e[0][0] <= xScale(d[cell.x]) && xScale(d[cell.x]) <= e[1][0])
        //         && ((e[0][1] <= yScale(d[cell.y]) && yScale(d[cell.y]) <= e[1][1]));
        // });

        // svg.selectAll('.cell')
        //     .each(function(c){
        //         c.update(this, filtered);
        //     });
    }
}

function brushend() {
    // If there is no longer an extent or bounding box then the brush has been removed
    if(!d3.event.selection) {
        // Bring back all hidden .dot elements
        svg.selectAll('.hidden').classed('hidden', false);

        // Challenge 1: FILTER ON BRUSH
        // svg.selectAll('.cell')
        //     .each(function(c){
        //         c.update(this, cars);
        //     });

        // Return the state of the active brushCell to be undefined
        brushCell = undefined;
    }
}

// Remember code outside of the data callback function will run before the data loads