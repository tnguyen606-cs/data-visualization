    // Global function called when select element is changed
    function onCategoryChanged() {
        var select = d3.select('#categorySelect').node();
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

// **** How to properly load data ****
d3.csv('./letter_freq.csv',
    function(row) {
        return {
            letter: row.letter,
            frequency: +row.frequency
        };
    },
    function(error, dataset) {
        if(error) {
            console.error('Error while loading ./letter_freq.csv dataset.');
            console.error(error);
            return;
        }

        letters = dataset;

        // Set up the variables and functions that we need for our bar chart
        var maxFreq = d3.max(dataset, function(d){
            return d.frequency;
        });

        xScale = d3.scaleLinear()
            .domain([0, maxFreq])
            .range([0, chartWidth]);

        svg.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'translate('+[svgWidth / 2, 30]+')')
            .text('Letter Frequency (%)');

        var formatPercent = function(d) {
            return d * 100 + '%';
        }

        // Add axes here, if you put them in the updateChart method, multiple axes will be added
        // We'll go over how to update axes with interaction in the next labs
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate('+[padding.l, padding.t]+')')
            .call(d3.axisTop(xScale).ticks(6).tickFormat(formatPercent));

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate('+[padding.l, svgHeight - padding.b]+')')
            .call(d3.axisBottom(xScale).ticks(6).tickFormat(formatPercent));

        updateChart('all-letters');
    });


function updateChart(filterKey) {
    var filteredLetters = letters.filter(function(d){
        return lettersMap[filterKey].indexOf(d.letter) >= 0;
    });

    // **** Your JavaScript code goes here ****

    // Create a d3-selection using the 'bar' classname
    // Very important to use the same classname that we specify below
    var bars = chartG.selectAll('.bar')
        .data(filteredLetters, function(d){
            return d.letter; // Use a key-function to maintain object constancy
        });

    // Create the enter selection
    // Here we will append new groups
    var barsEnter = bars.enter() // Remember enter makes a placeholder for new elements
        .append('g')
        .attr('class', 'bar');

    // Create an UPDATE + ENTER selection
    // Selects all data-bound elements that are in SVG or just added to SVG
    bars.merge(barsEnter)
        .attr('transform', function(d,i){
            return 'translate('+[0, i * barBand + 4]+')'; // Update position based on index
        });


    // Add rectangles to the ENTER selection
    // This will add a rectangle to each new group element
    barsEnter.append('rect')
        .attr('height', barHeight)
        .attr('width', function(d){
            return xScale(d.frequency);
        });

    // Add text to the ENTER selection
    // This will add a text to each new group element
    barsEnter.append('text')
        .attr('x', -20)
        .attr('dy', '0.9em')
        .text(function(d){
            return d.letter;
        });

    // Use the EXIT selection to remove all bars that have been filtered out
    // Using a key-function in the data() method is crucial to a proper EXIT
    bars.exit().remove();
}
<<<<<<< HEAD
// Remember code outside of the data callback function will run before the data loads
=======
// Remember code outside of the data callback function will run before the data loads
>>>>>>> 39903ba1458105e8a73888970d35f37471ef05b5
