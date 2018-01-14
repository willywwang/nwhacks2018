angular.module('app')
.controller('mainController', ['$scope', '$rootScope', '$http', '$window', '$uibModal',
	function($scope, $rootScope, $http, $window, $uibModal) {
		$scope.restaurants = [];
		$scope.filteredRestaurants = [];
		$scope.selectedRestaurant = {};
		$scope.markers = {};
		
		function initPage() {
			$scope.activeLink = 'restaurant';

			var mapOptions = {
				zoom: 17,
				center: new google.maps.LatLng(49.2807513, -123.1152712),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true,
				zoomControl: true,
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

					$scope.userMarker = new google.maps.Marker({
						position: initialLocation,
						map: $scope.map,
						icon: 'http://www.robotwoods.com/dev/misc/bluecircle.png'
					});
				});
			}

			loadRestaurantMarkers();
		}

		function loadRestaurantMarkers() {
			var location = $scope.map.getCenter();

			var request = {
				lat: location.lat(),
				lon: location.lng(),
				radius: 500,
				offset: 0
			};

			// $http.post('/data', request).success(function(data) {
			// 	console.log(data);
			// 	$scope.restaurants = data.map(r => r.restaurant);

			// 	$scope.restaurants.forEach(function(restaurant) {
			// 		$scope.markers[restaurant.name] = new google.maps.Marker({
			// 			map: $scope.map,
			// 			position: new google.maps.LatLng(restaurant.location.latitude, restaurant.location.longitude),
			// 			title: restaurant.name
			// 		});

			// 		google.maps.event.addListener($scope.markers[restaurant.name], 'click', function () {
			// 			var selectedRestaurantName = restaurant.name;
			// 			$scope.selectedRestaurant = $scope.restaurants.filter(r => r.name == selectedRestaurantName)[0];

			// 			$uibModal.open({
			// 				templateUrl: 'restaurant.template.html',
			// 				controller: 'modalController',
			// 				resolve: {
			// 					selectedRestaurant: function() {
			// 						return $scope.selectedRestaurant;
			// 					}
			// 				}
			// 			});
			// 		});
			// 	});
			// }, function(err) {
			// 	console.log(err);
			// });


			//TODO: avoid callback hell - also when there aren't 100 restaurants
			$http.post('/data', request).success(function(data) {
				request.offset = 50;
				$http.post('/data', request).success(function(data1) {
					request.offset = 100;
					$http.post('/data', request).success(function(data2) {
						request.offset = 150;
						$http.post('/data', request).success(function(data3) {	
							$scope.restaurants = data.businesses;
							$scope.restaurants = $scope.restaurants.concat(data1.businesses);
							$scope.restaurants = $scope.restaurants.concat(data2.businesses);
							$scope.restaurants = $scope.restaurants.concat(data3.businesses);

							$scope.restaurants.forEach(function(restaurant) {
								console.log(restaurant);
								$scope.markers[restaurant.name] = new google.maps.Marker({
									map: $scope.map,
									position: new google.maps.LatLng(restaurant.coordinates.latitude, restaurant.coordinates.longitude),
									title: restaurant.name
								});

								google.maps.event.addListener($scope.markers[restaurant.name], 'click', function () {
									var selectedRestaurantName = restaurant.name;
									$scope.selectedRestaurant = $scope.restaurants.filter(r => r.name == selectedRestaurantName)[0];

									$uibModal.open({
										templateUrl: 'restaurant.template.html',
										controller: 'modalController',
										resolve: {
											selectedRestaurant: function() {
												return $scope.selectedRestaurant;
											}
										}
									});
								});
							});

							$scope.filteredRestaurants = $scope.restaurants.splice(0, 25);
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