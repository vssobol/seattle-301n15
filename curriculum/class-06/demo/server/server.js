'use strict';

//load Environtment Variable from the .env
require('dotenv').config();

//declare Application Dependancies
const express = require('express');
const cors = require('cors');

//Application Setup
const PORT = process.env.PORT;
const app  = express();
app.use(cors());

//route syntax = app.<operation>('<route>', callback );
app.get('/', (request, response) => {
    response.send('Home Page!');
})

app.get('/bad', (request, response) => {
    throw new Error('bummer');
})

//the callback can be a separate function. Really makes readable.
app.get('/about', aboutUsHandler);

function aboutUsHandler(request, response) {
    response.status(200).send('This is the About Us page .html');
}

// app.get('*', (request, response) => {
//     response.status(404).send('This route does not exist')
// })

//API routes
app.get('/location', (request, response) => {
    try{
        const geoData = require('./data/geo.json');
        const city = request.query.data;
        const locationData = new Location(city, geoData);
        console.log('locationData ',locationData);
        response.send(locationData);
    }
    catch(error){
        //some function or error message
        errorHandler('So sorry, something went wrong', request, response);
    }
})

//Helper Funcitons
function Location(city, geoData){
    this.search_query = city;
    this.formatted_query = geoData.results[0].formatted_address;
    this.latitude = geoData.results[0].geometry.location.lat;
    this.longitude = geoData.results[0].geometry.location.lng;
}

function errorHandler(error, request, response) {
    response.status(500).send(error);
}



//Ensure the server is listening for requests
// THIS MUST BE AT THE BOTTOM OF THE FILE!!!!
app.listen(PORT, () => console.log(`The server is up, listening on ${PORT}`));