

//GOOGLE MAPS GEOCODER
const googleMapsClient = require('@google/maps').createClient({
  key: 'process.env.GOOGLEMAPS_APIKEY',
  Promise: Promise
});

googleMapsClient.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA' //add siteaddress, sitecity, sitezipcode
})
  .asPromise()
  .then((response) => {
    console.log(response.json.results);
  })
  .catch((err) => {
    console.log(err);
  });

// use follow redirects
var https = require('follow-redirects').https;

var placeDetails = function () {
  this.places = [];
}

//Step 1: Get coordinates based on the entered zipcode.

function getCoordinates(zipcode) {
  https.request({
      host: 'maps.googleapis.com',
      path: '/maps/api/geocode/json?address=' + zipcode + '&key=process.env.GOOGLEMAPS_APIKEY',
      method: 'GET'
    },
    CoordinateResponse).end();
}