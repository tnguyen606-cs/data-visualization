// DOM #main div element
var main = document.getElementById('main');

// **** Your JavaScript code goes here ****

//Paste your characters array from Activity 0
var characters = [{name: "John Snow",status: "Alive again",current_location: "winterfell",power_rank:3, house: "stark",house_affilations: "stark",probability_of_survival:84},{name: "Davos Seaworth",status: "Alive",current_location: "winterfell",power_rank:-1, house: "stark",house_affilations: ["stark","baratheon"],probability_of_survival:78},{name: "Tyrion Lannister",status: "Alive",current_location: "way to Westeros",power_rank:4, house: "tagaryen",house_affilations: ["tagaryen","lannister"],probability_of_survival:70},{name: "Daenerys Targaryen",status: "Alive",current_location: "way to Westeros",power_rank:1, house: "targaryen",house_affilations: "targaryen",probability_of_survival:99}]



// Activity 1.1
// halfSurvival takes in character and returns 50% of the character's probability_of_survival
function halfSurvival(character) {
    return  (character.probability_of_survival)/2
}

// TO DO: For loop to call on halfSurvival function on all of your characters but one (the one you chose)


// Activity 1.2
// debugCharacters, loops through an array of characters and logs their name and the new probability of survival


// Call debug characters


// Activity 1.3

function addCharacterToDom(character) {
  // TO DO: Create new <div> element

  // Append the newly created <div> element to #main

  // Create a new <h5> element for characters' name

  // Append the newly created <h5> element to your new div

  // Set the textContent to the character's name


  // Do the same for house, probability of survival, and status using <p> element instead of <div> element
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
}

// Add a header to the DOM
// Create a new <h3> element
var header = document.createElement("h3");
// Append the newly created <h3> element to #main
main.appendChild(header);
// Set the textContent to:
header.textContent = "My Favorite GoT Characters";

// TO DO: For-loop on characters array, call addCharacterToDom method for each character
addCharacterToDom(characters) 
