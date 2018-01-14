angular.module('app')
.controller('mainController', ['$scope', '$rootScope', '$http', '$window', '$uibModal',
	function($scope, $rootScope, $http, $window, $uibModal) {
		$scope.user = null;
		$scope.isLoggedIn = false;
		$scope.restaurants = [];
		$scope.filteredRestaurants = [];
		$scope.selectedRestaurant = {};
		$scope.completeSetRestaurants = [];
		$scope.markers = {};
		$scope.coords = {};
		$scope.search = "";
		$scope.imageUrl = "";
		
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
					"featureType": "landscape.natural",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"visibility": "on"
						},
						{
							"color": "#e0efef"
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"visibility": "on"
						},
						{
							"hue": "#1900ff"
						},
						{
							"color": "#c0e8e8"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "geometry",
					"stylers": [
						{
							"lightness": 100
						},
						{
							"visibility": "simplified"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "labels",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "transit.line",
					"elementType": "geometry",
					"stylers": [
						{
							"visibility": "on"
						},
						{
							"lightness": 700
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "all",
					"stylers": [
						{
							"color": "#7dcdcd"
						}
					]
				}
			]
			};


			$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					$scope.coords.lat = initialLocation.lat();
					$scope.coords.lng = initialLocation.lng();
					$scope.map.setCenter(initialLocation);

					$scope.userMarker = new google.maps.Marker({
						position: initialLocation,
						map: $scope.map,
						icon: 'http://www.robotwoods.com/dev/misc/bluecircle.png'
					});

					$scope.loadRestaurantMarkers();
				});
			}

			$scope.imageUrl = '/resources/usericon.png';

			$http.get('/user').success(function(data) {
				$scope.user = data;

				if (Object.keys($scope.user).length > 0) {
					$scope.isLoggedIn = true;
					console.log($scope.user);
					$scope.imageUrl = 'http://graph.facebook.com/' + $scope.user.data.facebook.id + '/picture?type=square';
				}
			}, function(err) {

				console.log(err);
			});
		}

		$scope.$watch("search", function(newValue, oldValue) {
			if (newValue !== oldValue) {
				$scope.clearMarkers();
				$scope.restaurants = $scope.searchCriteriaMatch($scope.completeSetRestaurants);

				$scope.restaurants.forEach(function(restaurant) {
					$scope.markers[restaurant.name] = new google.maps.Marker({
						map: $scope.map,
						position: new google.maps.LatLng(restaurant.coordinates.latitude, restaurant.coordinates.longitude),
						title: restaurant.name
					});

					google.maps.event.addListener($scope.markers[restaurant.name], 'click', function () {
						var selectedRestaurantName = restaurant.name;
						$scope.selectedRestaurant = $scope.completeSetRestaurants.filter(r => r.name == selectedRestaurantName.trim())[0];

						$uibModal.open({
							templateUrl: 'restaurant.template.html',
							controller: 'modalController',
							resolve: {
								selectedRestaurant: function() {
									return $scope.selectedRestaurant;
								},
								isLoggedIn: function() {
									return $scope.isLoggedIn;
								},
								user: function() {
									return $scope.user;
								},
								imageUrl: function() {
									return $scope.imageUrl;
								}
							}
						});
					});
				});

				$scope.filteredRestaurants = $scope.restaurants.slice(0, 25);
			}
		});

		$scope.clearMarkers = function() {
			Object.keys($scope.markers).forEach(function(key) {
				$scope.markers[key].setMap(null);
			});
		};

		$scope.searchCriteriaMatch = function (items) {
			if (!$scope.search || $scope.search.length < 1) {
				return items;
			}

			$scope.search = $scope.search.toLowerCase();

			items = items.filter(i => i.name.toLowerCase().includes($scope.search) ||
				doesCategoriesIncludeSearchCriteria(i.categories));

			return items;
		};

		function doesCategoriesIncludeSearchCriteria(categories) {
			categories.forEach(function(category) {
				if (category.title.toLowerCase().includes($scope.search)) {
					return true;
				}
			})

			return false;
		}

		$scope.loadRestaurantMarkers = function() {
			$scope.clearMarkers();
			var location = $scope.map.getCenter();

			var request = {
				lat: $scope.coords.lat,
				lon: $scope.coords.lng,
				radius: 15000,
				offset: 0
			};


			//TODO: avoid callback hell - also when there aren't 100 restaurants
			$http.post('/data', request).success(function(data) {
				request.offset = 50;
				$http.post('/data', request).success(function(data1) {
					request.offset = 100;
					$http.post('/data', request).success(function(data2) {
						request.offset = 150;
						$http.post('/data', request).success(function(data3) {	
							$scope.completeSetRestaurants = data.businesses;
							$scope.completeSetRestaurants = $scope.restaurants.concat(data1.businesses);
							$scope.completeSetRestaurants = $scope.restaurants.concat(data2.businesses);
							$scope.completeSetRestaurants = $scope.restaurants.concat(data3.businesses);

							$scope.restaurants = $scope.completeSetRestaurants;

							$scope.completeSetRestaurants.forEach(function(restaurant) {
								$scope.markers[restaurant.name] = new google.maps.Marker({
									map: $scope.map,
									position: new google.maps.LatLng(restaurant.coordinates.latitude, restaurant.coordinates.longitude),
									title: restaurant.name
								});

								google.maps.event.addListener($scope.markers[restaurant.name], 'click', function () {
									var selectedRestaurantName = restaurant.name;
									$scope.selectedRestaurant = $scope.completeSetRestaurants.filter(r => r.name == selectedRestaurantName.trim())[0];

									$uibModal.open({
										templateUrl: 'restaurant.template.html',
										controller: 'modalController',
										resolve: {
											selectedRestaurant: function() {
												return $scope.selectedRestaurant;
											},
											isLoggedIn: function() {
												return $scope.isLoggedIn;
											},
											user: function() {
												return $scope.user;
											},
											imageUrl: function() {
												return $scope.imageUrl;
											}
										}
									});
								});
							});

							console.log($scope.markers);

							$scope.filteredRestaurants = $scope.restaurants.slice(0, 25);
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

		$scope.openSignInModal = function() {
			console.log($scope.user);
			$uibModal.open({
				templateUrl: 'signin.template.html',
				controller: 'modalController',
				resolve: {
					selectedRestaurant: function() {
						return $scope.selectedRestaurant;
					},
					isLoggedIn: function() {
						return $scope.isLoggedIn;
					},
					user: function() {
						return $scope.user;
					},
					imageUrl: function() {
						return $scope.imageUrl;
					}
				}
			})
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