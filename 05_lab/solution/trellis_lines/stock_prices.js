// **** Example of how to create padding and spacing for trellis plot****
var svg = d3.select('svg');

// Hand code the svg dimensions, you can also use +svg.attr('width') or +svg.attr('height')
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

// Define a padding object
// This will space out the trellis subplots
var padding = {t: 20, r: 20, b: 60, l: 60};

// Compute the dimensions of the trellis plots, assuming a 2x2 layout matrix.
trellisWidth = svgWidth / 2 - padding.l - padding.r;
trellisHeight = svgHeight / 2 - padding.t - padding.b;

// As an example for how to layout elements with our variables
// Lets create .background rects for the trellis plots
svg.selectAll('.background')
    .data(['A', 'B', 'C', 'C']) // dummy data
    .enter()
    .append('rect') // Append 4 rectangles
    .attr('class', 'background')
    .attr('width', trellisWidth) // Use our trellis dimensions
    .attr('height', trellisHeight)
    .attr('transform', function(d, i) {
        // Position based on the matrix array indices.
        // i = 1 for column 1, row 0)
        var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
        var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
        return 'translate('+[tx, ty]+')';
    });

var parseDate = d3.timeParse('%b %Y');
// To speed things up, we have already computed the domains for your scales
var dateDomain = [new Date(2000, 0), new Date(2010, 2)];
var priceDomain = [0, 223.02];

// **** How to properly load data ****
d3.csv('./stock_prices.csv', function(error, dataset) {
    if(error) {
        console.error('Error while loading ./stock_prices.csv dataset.');
        console.error(error);
        return; // Early return out of the callback function
    }

// **** Your JavaScript code goes here ****

    dataset.forEach(function(price) {
        price.date = parseDate(price.date);
    });

    // Use d3-nest to reformat the tabular dataset
    var nested = d3.nest()
        .key(function(d) {
            return d.company; // Nest by company name
        })
        .entries(dataset);

<<<<<<< HEAD
=======
    console.log(nested);

>>>>>>> 39903ba1458105e8a73888970d35f37471ef05b5
    // Set up x-scale
    var xScale = d3.scaleTime()
        .domain(dateDomain) // Scale time requires domain is Date objects
        .range([0, trellisWidth]); // Range is width of trellis chart space

    var yScale = d3.scaleLinear()
        .domain(priceDomain) // Scale is flipped so line-chart grows upward
        .range([trellisHeight, 0]); // Range is height of trellis chart space

    // Use standard d3 categorical color scale
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(nested.map(function(d){ // Returns an array of strings ['IBM', 'MSFT', ...]
            return d.key;
        }));

    // Use d3's path generator to specify the d-attribute of the line chart paths
    // See John T.'s Piazza post for what this function does
    var lineInterpolate = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.price); });

    // Create and translate new group elements for each trellis subplot
    var trellisG = svg.selectAll('.trellis')
        .data(nested)
        .enter()
        .append('g')
        .attr('class', 'trellis')
        .attr('transform', function(d,i) {
            // Use indices to space out the trellis groups in 2x2 matrix
            var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
            var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
            return 'translate('+[tx, ty]+')';
        });

    // Create all grid elements before the lines so the lines appear above them
    // Remember SVG does not have a z-index, things appended last will appear ontop
    var xGrid =d3.axisTop(xScale)
        .tickSize(-trellisHeight, 0, 0) // Use tick size to create grid line, 0 refers to no domain path
        .tickFormat(''); // Text elements return empty string, hack for no text on each tick

    // Append and call the xGrid
    // Appending to "trellisG" will append a grid to all 4 trellis plots
    trellisG.append('g')
        .attr('class', 'x grid')
        .call(xGrid);

    // Create a grid for the y-scale
    var yGrid = d3.axisLeft(yScale)
        .tickSize(-trellisWidth, 0, 0) // Use tick size to create grid line
        .tickFormat('') // Text elements have empty string

    // Append and call yGrid
    trellisG.append('g')
        .attr('class', 'y grid')
        .call(yGrid);

    // Appending to "trellisG" will append a grid to all 4 trellis plots
    trellisG.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,'+trellisHeight+')') // Only translate within trellis pixel space
        .call(d3.axisBottom(xScale));

    // Appending to "trellisG" will append a grid to all 4 trellis plots
    trellisG.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(d3.axisLeft(yScale));

    // Add label for each trellis subplot, text color and content based on company
    trellisG.append('text')
        .attr('class', 'company-label')
        .attr('transform', 'translate('+[trellisWidth / 2, trellisHeight / 2]+')')
        .attr('fill', function(d){
            return colorScale(d.key);
        })
        .text(function(d){
            return d.key;
        });

    // Add axis label for each axis! Don't forget to add labels!
    trellisG.append('text')
        .attr('class', 'x axis-label')
        .attr('transform', 'translate('+[trellisWidth / 2, trellisHeight + 34]+')')
        .text('Date (by Month)');
    trellisG.append('text')
        .attr('class', 'y axis-label')
        .attr('transform', 'translate('+[-30, trellisHeight / 2]+') rotate(270)')
        .text('Stock Price (USD)');

    // Finally the important stuff! Use nested selection to append a new path.line-plot element for each subplot
    trellisG.selectAll('.line-plot')
        .data(function(d){
            // d3 data() function also takes a data callback function
            // d in this scope refers to the {key:"COMPANY", values:[]} object that is bound to trellisG
            return [d.values]; // return an array with one element b/c we only want to append one <path> element
        })
        .enter()
        .append('path')
        .attr('class', 'line-plot') // add classname
        .attr('d', lineInterpolate) // Use d3 path-generator to define the d-attribute, this defines the points and line segments of the path
        .style('stroke', function(d) {
            return colorScale(d[0].company); // color path based on company attribute
        });
});
<<<<<<< HEAD
// Remember code outside of the data callback function will run before the data loads
=======
// Remember code outside of the data callback function will run before the data loads
>>>>>>> 39903ba1458105e8a73888970d35f37471ef05b5
