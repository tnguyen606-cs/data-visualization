// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    console.log(select);
    console.log(select.selectedIndex);
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(category);
}


var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 30, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Compute the spacing for bar bands based on all 26 letters
var barBand = chartHeight / 26;
var barHeight = barBand * 0.7;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// A map with arrays for each category of letter sets
var lettersMap = {
    'all-letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    'only-consonants': 'BCDFGHJKLMNPQRSTVWXZ'.split(''),
    'only-vowels': 'AEIOUY'.split('')
};


d3.csv('./letter_freq.csv',
    // Load data and use this function to process each row
    function(row) {
        return {
            letter: row.letter,
            frequency: +row.frequency
        };
    },
    function(error, dataset) {
        // Log and return from an error
        if(error) {
            console.error('Error while loading ./letter_freq.csv dataset.');
            console.error(error);
            return;
        }

        // Create global variables here and intialize the chart

        // **** Your JavaScript code goes here ****

        // Create a width scale using linear scale: domain (frequency), range ([0, chartWidth])
        letters = dataset;

        xScale = d3.scaleLinear()
        .domain([0,0.2]) // Scale time requires domain is Date objects
        .range([0, chartWidth]); 

        // Create two x-axis

        svg.append('g') // Append a g element for the scale
       .attr('class', 'x axis') // Use a class to css style the axes together
       .attr('transform', 'translate(40,40)') // Position the axis
       .call(d3.axisTop(xScale).ticks(6) .tickFormat(d => d*100 + "%"));

       svg.append('g') // Append a g element for the scale
       .attr('class', 'x axis') // Use a class to css style the axes together
       .attr('transform', 'translate(40,580)') // Position the axis
       .call(d3.axisBottom(xScale).ticks(6) .tickFormat(d => d*100 + "%"));  

        // Create x-label

        svg.append('text')
       .attr('class', 'x label')
       .attr('transform','translate(100,10)')
       .attr('dy','0.3em')
       .text('Letter Frequency (%)');

        // Update the chart for all letters to initialize
        updateChart('all-letters');
    });


function updateChart(filterKey) {
    // Create a filtered array of letters based on the filterKey
    var filteredLetters = letters.filter(function(d){
        return lettersMap[filterKey].indexOf(d.letter) >= 0;
    });

    // **** Draw and Update your chart here ****

    // Create an update selection
    var bars = chartG.selectAll('.bar')
    .data(filteredLetters, function(d){
        return d.letter;
    });


    // Enter and append all new elements
    var barsEnter = bars.enter()
    .append('g')
    .attr('class', 'bar');
    
bars.merge(barsEnter)
	.attr('transform', function(d,i){
        return 'translate('+[0, i * barBand + 4]+')';
    });

barsEnter.append('rect')
    .attr('height', barHeight)
    .attr('width', function(d){
        return xScale(d.frequency);
    });

barsEnter.append('text')
    .attr('x', -20)
    .attr('dy', '0.9em')
    .text(function(d){
        return d.letter;
    });

    // Exit and remove filtered bars
    bars.exit().remove();
}
// Remember code outside of the data callback function will run before the data loads
