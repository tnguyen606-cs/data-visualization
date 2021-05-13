// JavaScript code goes here

// Activity 0.3
// Declare local characters array




// Activity 0.3
// print the entire characters array using console.log(), Web Console will show an expandable version of the array


// Activity 0.4
// Name of the first character


// All the affiliated houses of the 2nd character


// The status of the last character


// If any of the characters are at the same location (true or false)


// The mean probability of all the characters' survival

var characters = [{name: "John Snow",status: "Alive again",current_location: "winterfell",power_rank:3, house: "stark",house_affilations: "stark",probability_of_survival:84},{name: "Davos Seaworth",status: "Alive",current_location: "winterfell",power_rank:-1, house: "stark",house_affilations: ["stark","baratheon"],probability_of_survival:78},{name: "Tyrion Lannister",status: "Alive",current_location: "way to Westeros",power_rank:4, house: "tagaryen",house_affilations: ["tagaryen","lannister"],probability_of_survival:70},{name: "Daenerys Targaryen",status: "Alive",current_location: "way to Westeros",power_rank:1, house: "targaryen",house_affilations: "targaryen",probability_of_survival:99}]
console.log(characters)
console.log(characters[0].name)
console.log(characters[1].house_affilations)
console.log(characters[3].status)
console.log(true)
var probability = (characters[0].probability_of_survival+characters[1].probability_of_survival+characters[3].probability_of_survival)/3
console.log(probability)
console.log("Shengrui Lyu")

function halfSurvival(character) {
	return  (character.probability_of_survival)/2
}

for(var i =0; i<3;i++){
	if (i==1){
		characters[i].probability_of_survival=halfSurvival(characters[i])
	}
}

function debugCharacters() {
	// body...
	for (var j = 3; i >= 0; i--) {
		console.log(characters[i].name)
		console.log(characters[i].probability_of_survival)
	}
}

// document is the DOM, select the #main div
var main = document.getElementById("main");

// Create a new DOM element
var header = document.createElement("h3");
// Append the newly created <h3> element to #main
main.appendChild(header);
// Set the textContent to:
header.textContent = "My Favorite GoT Characters";

// Create a new <div> element
var div1 = document.createElement("div");
// Append the newly created <div> element to #main
main.appendChild(div1);

// Create a new <h5> element
var name1 = document.createElement("h5");
// Append the newly created <h5> element to your new div
div1.appendChild(name1);
// Set the textContent to the first characters name
name1.textContent = characters[0]["name"];

// Create a new <p> element
var survival1= document.createElement("p");
// Append the newly created <p> element to your new div
div1.appendChild(survival1);
// Set the textContent to the first characters survival prob.
survival1.textContent = "Survival %: " +characters[0]["probability_of_survival"] +"%";