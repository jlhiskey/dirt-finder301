'use strict';

function initMap() {

let map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 47.669759,
      lng: -122.313238
    },
    zoom: 8
  });
  var marker = new google.maps.Marker({
    position: {
      lat: 47.669759,
      lng: -122.313238
    },
    map: map,
    title: 'Hello World!'
  });




}

