'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());


// Locations Cache
let locations = {};

// API Routes

/**
 * Notice that on day 2, we pull out the inline callbacks into helper functions.
 * Much more readable, scalable
 */
app.get('/location', getLatLong);
app.get('/weather', getWeather);


/**
 * LECTURE: fetch() method to help DRY out our api calls, since they all do the same job
 * Will take a url to fetch and a constructor function as a callback
 * Sends any returned data to the constructor function
 * @param url
 * @param Constructor
 * @returns {Promise<any>}
 */
function fetchRemoteData(url,Constructor) {
  return superagent.get(url)
    .then( data => {
      return new Constructor(data.body);
    });
}

/**
 * Renderer -- uses a passed in response object to render out data in JSON format
 * LECTURE: More DRY-Ness ....
 * Pulled out the rendering from the other functions
 * @param data
 * @param response
 */
function render(data, response) {
  response.status(200).json(data);
}

/**
 * Error Handler
 * LECTURE: Even More Dryness ...
 * This could be middleware
 * @param error
 * @param response
 */
function showError( error, response ) {
  console.error(error);
  response.status(500).send('Status: 500. So sorry, something went wrong.');
}

/**
 * LECTURE: Refactored to use the new fetch helper function instead of doing it all itself
 * Retrieves Latitude and Longitude from an API
 * Requires a valid google api key, stored in GEOCODE_API_KEY in the .env file
 * @param query
 * @returns {Location}
 */

function getLatLong(request,response) {

  const city = request.query.data;

  if ( locations[city] ) {
    console.log(locations[city], 'found');
    render(locations[city], response);
  }
  else {

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;

    fetchRemoteData(url, Location)
      .then(data => {
        let SQL = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *';
        let values = [city, data.formatted_query, data.latitude, data.longitude];
        client.query(SQL, values)
          .then( results => {
            render(results.rows[0], response);
          })
          .catch(err => console.error(err));
      })
      .catch(error => showError(error, response));
  }
}

/**
 * Lat/Long Constructor Function
 * @param query - Contains the looked up location
 * @param geoData - JSON formatted data from the location API
 * @constructor
 */
function Location(geoData) {
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

/**
 * LECTURE: Refactored to use the new fetch helper function instead of doing it all itself
 * Retrieves Weather Forecast Data from an API, using a helper function
 * Why a helper function?
 * Every function should just do one thing.  In this case, a function to figure out the URL and fetch it and another one that renders that result. Try and keep the logic out of the route handlers where we can.
 * Can we predict a world where the other APIs are also all doing the same thing?
 * @param request
 * @param response
 */
function getWeather(request,response) {
  getWeatherData(request.query.data)
    .then( data => render(data, response) )
    .catch( error => showError(error, response) );
}

/**
 * Helper function to retrieve Weather Forecast Data from an API
 * Requires a valid dark sky api key, stored in WEATHER_API_KEY in the .env file
 * sample; http://localhost:3000/weather?data%5Blatitude%5D=47.6062095&data%5Blongitude%5D=-122.3320708
 *   That encoded query string is: data[latitude]=47.6062095&data[longitude]=122.3320708
 * @param {location} - Object with latitude and longitude properties.
 * @returns {promise} - Fetch Promise
 */
function getWeatherData(location) {
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${location.latitude},${location.longitude}`;
  return fetchRemoteData(url, Weather);
}

/**
 * Weather Constructor Function
 * @param query - Contains the looked up location
 * @param weatherData - JSON formatted data from the weather API
 * @constructor
 */
function Weather(weatherData) {
  this.locale = weatherData.timeZone;
  this.current = weatherData.currently.summary;
  this.forecast = weatherData.daily.summary;
}


// Make sure the server is listening for requests
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// Make sure the server is listening for requests
client.connect()
  .then( () => {
    let SQL = 'SELECT * FROM locations';
    return client.query(SQL)
      .then(results => {
        locations = results.rows.reduce( (cache,entry) => {
          cache[entry['search_query']] = entry;
          return cache;
        }, {});
      })
      .catch(err => console.error(err));
  })
  .then( () => {
    app.listen(PORT, () => console.log(`Server up on ${PORT}`));
  });

