require("dotenv").config();
const fs = require('fs');

// ================================= Global variables ==================================
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var command = process.argv[2];
var namedElement = process.argv[3];

// ===================================== Functions =====================================
function start(command, namedElement) {

    switch (command) {
        case ("concert-this"):
            getConcert(namedElement);
            break;
        case ("spotify-this-song"):
            getSong(namedElement);
            break;
        case ("movie-this"):
            getMovie(namedElement);
            break;
        case ("do-what-it-says"):
            doFile();
            break;
        default:
            console.log("That is not a valid command. LIRI will now close.");
            process.exit
            break;
    }
}

function getConcert(artist) {
    axios
        .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (response) {
            response.data.forEach(element => {
                console.log("");
                console.log("Venue name: " + element.venue.name);
                console.log("Venue location: " + element.venue.city + ", " + element.venue.country);
                console.log("Event date: " + element.datetime);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getSong(song) {
    if (song === undefined) {
        song = "The Sign";
    }

    console.log(song);

    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            response.tracks.items.forEach(element => {
                console.log("");
                console.log("Artist Name: " + element.artists[0].name);
                console.log("Song Name: " + element.name);
                console.log("Song Preview: " + element.preview_url);
                console.log("Album Name: " + element.album.name);
            });
        })
        .catch(function (err) {
            console.log(err);
        });
}

function getMovie(movie) {
    if (movie === undefined) {
        movie = "Mr. Nobody";
    }

    movie = movie.split(' ').join('+')
    movie = movie.split('_').join('+')

    axios
        .get("https://www.omdbapi.com/?t=" + movie + "&plot=short&apikey=trilogy")
        .then(function (response) {
            console.log("");
            console.log("Title: " + response.data.Title);
            console.log("Release Date: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function doFile() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);

        var dataArr = data.split(",");
        start(dataArr[0], dataArr[1]);
    });
}

// ======================================== Main ========================================
start(command, namedElement);