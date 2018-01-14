angular.module('app')
.controller('mainController', ['$scope', '$rootScope', '$http', '$window', '$uibModal',
	function($scope, $rootScope, $http, $window, $uibModal) {
		var item = {
			coordinates: [49.2765, -123.2177]
		};

		var woa = {
			city: 'This is my marker. There are many like it but this one is mine.'
		};

		var mapOptions = {
			zoom: 17,
			center: new google.maps.LatLng(49.2807513, -123.1152712),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			styles: [
			{
				"featureType": "administrative",
				"elementType": "geometry",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "administrative.land_parcel",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "administrative.neighborhood",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "poi",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "poi",
				"elementType": "labels.text",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "poi.attraction",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "poi.business",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "poi.government",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "poi.medical",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "poi.park",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "poi.place_of_worship",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "poi.school",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"featureType": "poi.sports_complex",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			}]
		};


		$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				$scope.map.setCenter(initialLocation);
			});
		}

    	//add marker
    	$scope.addMarker = function(){
    		$scope.mymarker = new google.maps.Marker({
    			map: $scope.map,
    			animation: google.maps.Animation.DROP,
    			position: new google.maps.LatLng(item.coordinates[0], item.coordinates[1]),
    			title: woa.city
    		});
    	};
    }]);