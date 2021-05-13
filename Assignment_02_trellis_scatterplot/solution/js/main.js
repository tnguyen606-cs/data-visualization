// Select SVG
var svg = d3.select('svg');

// create svg width and height variables from index.html
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

// Define a padding object (top, right, bottom, left)
var padding = {t: 20, r: 20, b: 60, l: 60};

// Compute the dimensions of the trellis plots for a 2x2 layout
trellisWidth = svgWidth / 2 - padding.l - padding.r;
trellisHeight = svgHeight / 2 - padding.t - padding.b;

// Read the csv file and name dataset as realEstateData
d3.csv('./data/real_estate.csv', function(error, realEstateData) {

    // Error handling
    if (error) {
        console.error('Error loading real_estate.csv dataset.');
        console.error(error);
        return;
    }

    // Create a nest object group by location name
    var nested = d3.nest()
        .key(function(d) {
            return d.location;
        })
        .entries(realEstateData);

    // Get minimum of year_built from realEstateData
    var yearMin = d3.min(realEstateData, function(d) {
        return +d.year_built;
    });

    // Get maximum of year_built from realEstateData
    var yearMax = d3.max(realEstateData, function(d) {
        return +d.year_built;
    });

    // Format domain for x-axis (year)
    var yearDomain = [new Date(yearMin, 0), new Date(yearMax, 0)];


    // Get min and max of price_per_sqft for yScale using .extent
    var priceExtent = d3.extent(realEstateData, function(d) {
        return +d.price_per_sqft;
    });

    // Set xScale
    var xScale = d3.scaleTime()
        .domain(yearDomain)
        .range([0, trellisWidth]);

    // Set yScale
    var yScale = d3.scaleLinear()
        .domain(priceExtent)
        .range([trellisHeight, 0]);

    // Create 4 groups (one for each subplot)
    var trellisG = svg.selectAll('.trellis')
        .data(nested)
        .enter()
        .append('g')
        .attr('class', 'trellis')
        .attr('transform', function (d, i) { // i is index
            var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
            var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
            return 'translate('+[tx, ty]+')';
        });

    // Set xAxis with 6 ticks
    var xAxis = d3.axisBottom(xScale)
        .ticks(6);


    // Append x-axis to each subplot
    trellisG.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + trellisHeight + ')')
        .call(xAxis);

    // Set yAxis with 9 ticks
    var yAxis = d3.axisLeft(yScale)
        .ticks(9);

    // Append y-axis to each subplot
    trellisG.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // Location label for each subplot with transform to upper case
    trellisG.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate(' + [trellisWidth / 2, 30] + ')')
        .text(function(d) {
            return d.key.toUpperCase();
        });

    // Append x-label (Year Built) for each subplot
    trellisG.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate(' + [trellisWidth / 2, trellisHeight + 34] + ')')
        .text('Year Built')
        .style("font-size", "12px");

    // Append y-label (Price per Square Foot (USD)) for each subplot
    trellisG.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate(' + [-40, trellisHeight / 2] + ') rotate (-90)')
        .text('Price per Square Foot (USD)')
        .style("font-size", "12px");

    // Append each circle based on the data point with class node
    trellisG.selectAll('.node')
        .data(function (d) {
            return d.values;
        })
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('cx', function(d) {
            return xScale(new Date(d.year_built, 0));
        })
        .attr('cy', function(d) {
            return yScale(+d.price_per_sqft);
        })
        .attr('r', function (d) {
            return 3;
        })
        .style('fill', function (d) {
            if (d.beds > 2) {
                return '#2e5d90';
            }
            return '#499936';
        });
});
