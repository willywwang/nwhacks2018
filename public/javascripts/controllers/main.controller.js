angular.module('app')
.controller('mainController', ['$scope', '$rootScope', '$http', '$window', '$uibModal',
	function($scope, $rootScope, $http, $window, $uibModal) {
		function initPage() {
			$scope.activeLink = 'restaurant';

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

			loadRestaurantMarkers();
		}

		function loadRestaurantMarkers() {
			var location = $scope.map.getCenter();

			var request = {
				lat: location.lat(),
				lon: location.lng(),
				radius: 250,
				offset: 0
			};

			// TODO: avoid callback hell - also when there aren't 100 restaurants
			$http.post('/data', request).success(function(data) {
				request.offset = 20;
				$http.post('/data', request).success(function(data1) {
					request.offset = 40;
					$http.post('/data', request).success(function(data2) {
						request.offset = 60;
						$http.post('/data', request).success(function(data3) {
							request.offset = 80;
							$http.post('/data', request).success(function(data4) {
								var restaurants = data.restaurants;
								restaurants = restaurants.concat(data1.restaurants);
								restaurants = restaurants.concat(data2.restaurants);
								restaurants = restaurants.concat(data3.restaurants);
								restaurants = restaurants.concat(data4.restaurants);

								restaurants.forEach(function(restaurant) {
									var newRestaurant = restaurant.restaurant;
									$scope.marker = new google.maps.Marker({
										map: $scope.map,
										position: new google.maps.LatLng(newRestaurant.location.latitude, newRestaurant.location.longitude),
										title: newRestaurant.name
									});
								});
							}, function(err) {
								console.log(err);
							});
						}, function(err) {
							console.log(err);
						});
					}, function(err) {
						console.log(err);
					});
				}, function(err) {
					console.log(err);
				});
			}, function(err) {
				console.log(err);
			});
		}

		$scope.getActiveMenuLinkClass = function(path) {
			if (!path) {
				return '';
			}

			return ($scope.activeLink === path) ? 'active' : '';
		};

		$scope.openRestaurantList = function() {
			$scope.activeLink = 'restaurant';
		};

		$scope.openPeopleList = function() {
			$scope.activeLink = 'user';
		};

		initPage();
	}]);