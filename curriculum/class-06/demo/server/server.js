'use strict';

//load Environtment Variable from the .env
require('dotenv').config();

//declare Application Dependancies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

//Application Setup
const PORT = process.env.PORT;
const app  = express();
app.use(cors());

let locations = {};

//API routes
app.get('/location', getLatLong);
app.get('/weather', getWeather);
app.use('*', notFoundHandler);


//Helper Funcitons

function getLatLong(request, response){
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;
    if ( locations[url] ) {
        response.send(locations[url]);
    }
    else{
    superagent.get(url)
        .then( data => {
        const geoData = data.body;
        const location = new Location(request.query.data,geoData);
        locations[url] = location;
        response.send(location);
        })
        .catch( error => { errorHandler(error, request, response)});
    }
}

function getWeather(request, response){
    const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
 
  superagent.get(url)
    .then( data => {
      const weatherSummaries = data.body.daily.data.map(day => {
        return new Weather(day);
      });
      response.status(200).json(weatherSummaries);
    })
    .catch( () => {
      errorHandler('So sorry, something went wrong.', request, response);
    });
}

function notFoundHandler(request, response) {
    response.status(404).send('This route does not exist');
}

function errorHandler(error, request, response) {
    response.status(500).send(error);
}

//Constructors
function Location(city, geoData){
    this.search_query = city;
    this.formatted_query = geoData.results[0].formatted_address;
    this.latitude = geoData.results[0].geometry.location.lat;
    this.longitude = geoData.results[0].geometry.location.lng;
}

function Weather(day) {
    this.forecast = day.summary;
    this.time = new Date(day.time * 1000).toString().slice(0,15);
}

//Ensure the server is listening for requests
// THIS MUST BE AT THE BOTTOM OF THE FILE!!!!
app.listen(PORT, () => console.log(`The server is up, listening on ${PORT}`));