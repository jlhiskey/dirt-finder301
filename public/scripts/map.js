let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 47.669759,
            lng: -122.313238
        },
        zoom: 8
    });
}