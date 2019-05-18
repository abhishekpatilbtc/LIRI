require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
var Spotify = require('node-spotify-api');

// Grab search command line argument
var search = process.argv[2];
// Joining the remaining arguments since an actor or tv show name may contain spaces
var term = process.argv.slice(3).join("+");

// By default, if no search type is provided, search for a tv show
if (!search) {
    search = "show";
}

// By default, if no search term is provided, search for "Andy Griffith"
if (!term) {
    term = "Andy";
}


findConcert = function (artist) {
    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(URL).then(function (response) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var jsonData = response.data[0];

        var showData = [
            "Name of the venue: " + jsonData.venue.name,
            "Venue location: " + jsonData.venue.city + ", " + jsonData.venue.country,
            "Date of the Event " + jsonData.datetime
        ]
        console.log("Search Complete. Below are results: ")
        console.log(showData)
    });

}

//Spotify Code

searchSpotify = function () {
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: term }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // console.log(data)
        var jsonData = data.tracks.items[0];
        var showData = [
            "Artist(s): " + jsonData.artists[0].name,
            "The song's name: " + jsonData.name,
            "A preview link of the song from Spotify: " + jsonData.external_urls.spotify,
            "The album that the song is from: " + jsonData.album.name
        ]
        console.log("Search Complete. Below are results: ")
        console.log(showData)

    });

}

//

//Movie

searchMovie = function (movie) {
    var URL = "http://www.omdbapi.com/?apikey=d690e4f5&t=" + movie;
    axios.get(URL).then(function (response) {
        var jsonData = response.data;

        var showData = [
            "Title of the movie: " + jsonData.Title,
            "Year the movie came out: " + jsonData.Year,
            "IMDB Rating of the movie: " + jsonData.imdbRating,
            "Rotten Tomatoes Rating of the movie: " + jsonData.Ratings[1].Value,
            "Country where the movie was produced: " + jsonData.Country,
            "Language of the movie: " + jsonData.Language,
            "Plot of the movie: " + jsonData.Plot,
            "Actors in the movie: " + jsonData.Actors,

        ]
        console.log("Search Complete. Below are results: ")
        console.log(showData)
    });

}

//Do What It Says...
doWhat = function () {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var arr = data.split(",");
        search = arr[0];
        term = arr[1];
        conditions();

    });
}

//Conditions

function conditions() {
    switch (search) {
        case "concert-this":
            console.log("Searching for a concert...");
            findConcert(term)
            break;
        case "spotify-this-song":
            console.log("Searching for a song...");
            searchSpotify(term)
            break;
        case "movie-this":
            console.log("Searching for a movie...");
            searchMovie(term)
            break;
        case "do-what-it-says":
            console.log("Do what it says...");
            doWhat(term)
            break;
    }
}

conditions();