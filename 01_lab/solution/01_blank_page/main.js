// JavaScript code goes here

// Activity 0.3
// Declare local characters array
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

// Activity 0.3
// Log the entire characters array, Web Console will show an expandable version of the array
console.log(characters);

// Activity 0.4
// Name of the first character
console.log(characters[0]['name']);
// All the affiliated houses of the 2nd character
console.log(characters[1]['house_affiliations']);

// The status of the last character
console.log(characters[3]['status']);

// If any of the characters are at the same location (true or false)
console.log(characters[0]['location'] == characters[1]['location'] ||
            characters[0]['location'] == characters[2]['location'] ||
            characters[0]['location'] == characters[3]['location'] ||
            characters[1]['location'] == characters[2]['location'] ||
            characters[1]['location'] == characters[3]['location'] ||
            characters[2]['location'] == characters[3]['location']);

// The mean probability of all the characters' survival
console.log((characters[0]['probability_of_survival'] +
             characters[1]['probability_of_survival'] +
             characters[2]['probability_of_survival'] +
             characters[3]['probability_of_survival'])/4);

console.log("John Doe");
