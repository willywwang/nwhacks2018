function initMap() {
  var uluru = {
    lat: -25.363,
    lng: 131.044
  };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  for (var i = 0; i < places.businesses.length; i++) {
    addMarker(places.businesses[i]);
  }

  // adds a marker as well as an info box containing the rating of the spot
  function addMarker(place) {

    var icon = {
      url: "https://i.imgur.com/2b7gHaQ.png", // url
      scaledSize: new google.maps.Size(50, 50)
    };

    var marker = new google.maps.Marker({
       position: { lat: places.businesses[i].coordinates.latitude, lng: places.businesses[i].coordinates.longitude},
       map: map,
       icon: icon,
       address: places.businesses[i].location.address1,
       name: places.businesses[i].name
    });

    marker.addListener('click', function() {
      console.log(marker.address);
      $('#address-field').val(marker.address + ", Vancouver, BC"); // JQuery to change the value of the input field
      $('#name-field').val(marker.name); // JQuery to change the value of the input field
    });

  }

  // adds a marker on map when user clicks on a place on the map
  function placeMarkerAndPanTo(latLng, map) {
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
    map.panTo(latLng);
  }

}
