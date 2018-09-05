'use strict';

require('dotenv').config();
const pg = require('pg');
const express = require('express');
const twilio = require('twilio');
const googleMaps = require('@google/maps');
const PORT = process.env.PORT || 3000;
const app = express();
const conString = process.env.DATABASE_URL;

app.use(express.urlencoded({extended:true}));
// Client for postgres
const client = new pg.Client(conString);

client.connect();

// Client for google maps
const gmClient = googleMaps.createClient({
  key: process.env.GOOGLEMAPS_APIKEY,
  Promise: Promise
});

app.set('view engine', 'ejs');

//Routes

app.get('/', (req, res) => {
  homePage(req, res);
});


//Route Functions

function homePage(req, res) {
  res.render('master', {'thisPage':'partials/home.ejs', 'thisPageTitle':'Home'});
}

// Get Request to Google Geocoding API
gmClient.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
  //parse JSON
  //It should take in the street address, the city and State of database
  //Add lat and long to the database table
})
  .asPromise()
  .then((response) => {
    console.log(response.json.results);
  })
  .catch((err) => {
    console.log(err);
  });