// DOM #main div element
var main = document.getElementById('main');

// **** Your JavaScript code goes here ****

// From Activity 0
var characters = [
    {
        name: "Jon Snow",
        status: "Alive... Again",
        current_location: "Winterfell",
        power_ranking: 3,
        house: "stark",
        house_affiliations: ["stark"],
        probability_of_survival: 84
    },
    {
        name: "Davos Seaworth",
        status: "Alive",
        current_location: "Winterfell",
        power_ranking: -1,
        house: "stark",
        house_affiliations: ["stark", "baratheon"],
        probability_of_survival: 78
    },
    {
        name: "Tyrion Lannister",
        status: "Alive",
        current_location: "Way to Westeros",
        power_ranking: 4,
        house: "targaryen",
        house_affiliations: ["targaryen", "lannister"],
        probability_of_survival: 70
    },
    {
        name: "Daenerys Targaryen",
        status: "Alive",
        current_location: "Way to Westeros",
        power_ranking: 1,
        house: "targaryen",
        house_affiliations: ["targaryen"],
        probability_of_survival: 99
    }
];

// Activity 1.1
// halfSurvival takes in character and returns 50% of the character's probability_of_survival
function halfSurvival(character) {
    return character['probability_of_survival'] / 2;
}

for(var i = 0; i < characters.length; i++) {
    if(characters[i]['name'] != "Tyrion Lannister"){
        characters[i]['probability_of_survival'] = halfSurvival(characters[i]);
    }
}

// Activity 1.2
// debugCharacters, loops through an array of characters and logs their name and the new probability of survival
function debugCharacters() {
    for(var i = 0; i < characters.length; i++) {
        console.log(characters[i]['name'] + ' has a ' + characters[i]['probability_of_survival'] +
            '% chance of surviving.');
    }
}

// Call debug characters
debugCharacters();


// Activity 1.3
// This wasn't made immediately apparent in the instructions but a good way to create the DOM elements for each
// character is by creating a function that takes in a character object and creates elements for it

function addCharacterToDom(character) {
    // Create a new <div> element
    var div = document.createElement("div");
    // Append the newly created <div> element to #main
    main.appendChild(div);
    // Set class for character div element
    div.className = "character";

    // Create a new <h5> element
    var name = document.createElement("h5");
    // Append the newly created <h5> element to your new div
    div.appendChild(name);
    // Set the textContent to the character's name
    name.textContent = character["name"];
    // Set class for name element
    name.className = "name";

    // Create a new <p> element
    var house = document.createElement("p");
    // Append the newly created <p> element to your new div
    div.appendChild(house);
    // Set the textContent to the character's capitalized house
    house.textContent = "House: " + character["house"].charAt(0).toUpperCase() + character["house"].slice(1);
    // Set class for house element
    house.className = "house";

    // Create a new <p> element
    var survival= document.createElement("p");
    // Append the newly created <p> element to your new div
    div.appendChild(survival);
    // Set the textContent to the character's survival prob.
    survival.textContent = "Survival: " +character["probability_of_survival"] +"%";
    // Set class for survival element
    survival.className = "survival";

    // Create a new <p> element
    var status = document.createElement("p");
    // Append the newly created <p> element to your new div
    div.appendChild(status);
    // Set the textContent to the character's status.
    status.textContent = "Status: " +character["status"];
    // Set class for status element
    status.className = "status";
}

// Add a header to the DOM
// Create a new <h3> element
var header = document.createElement("h3");
// Append the newly created <h3> element to #main
main.appendChild(header);
// Set the textContent to:
header.textContent = "My Favorite GoT Characters";

// For-loop on characters array, call addCharacterToDom method for each character
for(var i = 0; i < characters.length; i++) {
    addCharacterToDom(characters[i]);
}
