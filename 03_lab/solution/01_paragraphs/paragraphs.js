
// **** Your JavaScript code goes here ****

// 1. Load in the dataset
d3.csv('./baseball_hr_leaders_2017.csv', function(error, datum){
    if(error) {
        console.error('Error loading baseball_hr_leaders_2017.csv dataset.');
        console.error(error);
        return;
    }

    var hrLeaders = d3.select('#homerun-leaders');

    hrLeaders.selectAll('.player')
        .data(datum)
        .enter()
        .append('p')
        .attr('class', 'player')
        .text(function(player){
            return player['rank'] + '. ' + player['name'] + ' with ' + player['homeruns'] + ' home runs';
        });

    var hrTableBody = d3.select('#homerun-table tbody');

    var trPlayer = hrTableBody.selectAll('tr')
        .data(datum)
        .enter()
        .append('tr');

    trPlayer.append('td')
        .style('text-align','center')
        .text(function(player){
            return player['rank'];
        });

    trPlayer.append('td')
        .text(function(player){
            return player['name'];
        });

    trPlayer.append('td')
        .style('text-align','center')
        .text(function(player){
            return player['homeruns'];
        });
});