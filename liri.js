require("dotenv").config();

var request = require('request');

var moment = require('moment');
// <!------------------------------------------------------------------->
// BAND NAME FOR BANDS IN TOWN- CONCERT THIS

// node liri.js concert-this <artist/band name here>

var artist = process.argv.slice(3).join('+'); // join words on plus sign
var action = process.argv[2];

// <!------------------------------------------------------------------->
// liri switch

function liriSwitch(action, artist) {

    switch (action) {
        case 'concert-this':
            searchBandsInTown(artist)
            break;
        case 'spotify-this-song':
            runSpotifyRequest(artist)
            break;
        case 'movie-this':
            runOMDB(artist)
            break;
        case 'do-what-it-says':
            runRandomTxt(artist)
        default:
            console.log("liri doesn't recognize that command")
    }
}
liriSwitch(action, artist);

function searchBandsInTown(artist) {
    console.log(artist)
    // Querying the bandsintown api for the selected artist
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryURL, function (error, response, body) {
        // make it readable object
        var concertInfo = JSON.parse(body);
        console.log(" The name of the venue is : " + concertInfo[0].venue.name);
        console.log(" The venue location is : " + concertInfo[0].venue.city);
        // Date of the Event (use moment to format this as "MM/DD/YYYY") "2017-03-19T11:00:00"
        var dateTimeConcert = moment(concertInfo[0].datetime).format('YYYY-MM-DD')
        console.log(" The date of the event is : " + dateTimeConcert + "");

    });
}
// searchBandsInTown(artist);
// <!------------------------------------------------------------------->
// SPOTIFY THIS SONG

// the command should take in this
// node liri.js spotify-this-song '<song name here>'

// create function 
function runSpotifyRequest(songName) {
    var Spotify = require('node-spotify-api');
    var keys = require('./keys');

    //Add the code required to import the keys.js file and store it in a variable.
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            var songInfo = data.tracks.items[0];
            var songResult =
                console.log("Artist name: " + songInfo.artists[0].name);
            console.log("Song name: " + songInfo.name);
            console.log("The album that the song is from: " + songInfo.album.name);
            console.log("A preview link of the song from Spotify: " + songInfo.preview_url);
        };
    })
}

// <!------------------------------------------------------------------->
// MOVIE THIS

// node liri.js movie-this '<movie name here>'
// function
function runOMDB(movieName) {
    // Include the axios npm package (Don't forget to run "npm install axios" in this folder first!)
    var axios = require("axios");

    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    axios.get(queryUrl).then(
        function (response) {

            // This will output the following information to your terminal/bash window:

            //    * Title of the movie.
            //    * Year the movie came out.
            //    * IMDB Rating of the movie.
            //    * Rotten Tomatoes Rating of the movie.
            //    * Country where the movie was produced.
            //    * Language of the movie.
            //    * Plot of the movie.
            //    * Actors in the movie.
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("Rated: " + response.data.Rated);
            console.log("Ratings for Rotten Tomatoes: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    );
}

// <!------------------------------------------------------------------->
// DO WHAT IT SAYS

// node liri.js do-what-it-says
// Using the fs Node package, LIRI will take the text inside of random.txt 
// and then use it to call one of LIRI's commands.

// function

function runRandomTxt() {
    // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.

    // fs is a core Node package for reading and writing files
    var fs = require("fs");

    // This block of code will read from the "random.txt" file.
    // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
    // The code will store the contents of the reading inside the variable "data"
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);

    });
}
