
// **** Your JavaScript code goes here ****
d3.csv('./baseball_hr_leaders_2017.csv', function(error, dataset) {
	// Here you have access to the dataset variable (if there was no error)
	var p = d3.select("homerun-leaders")
	.data(dataset)
	.enter()
	.append("p")
	.text(function(d, i) { 
		if (i<4) {
		return (i+1)+' '+d["name"]+' with '+ d["homeruns"]+ ' home runs';
}
		 });
d3.select('p').style('font-weight','bold').style('font-szie','1.9em');
});
