angular.module('app')
.controller('mainController', ['$scope', '$rootScope', '$http', '$window', '$uibModal',
	function($scope, $rootScope, $http, $window, $uibModal) {
		$scope.initPage = function() {
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

			$scope.loadRestaurantMarkers();
		}

		$scope.loadRestaurantMarkers = function() {
			var location = $scope.map.getCenter();
			console.log(location.lat());
			console.log(location.lng());
			// http request here
			$http({
				method: 'GET',
				url: 'https://developers.zomato.com/api/v2.1/search',
				headers: {'user_key' : '39d7b0047f4d3176f7115db315b09012'},
				params: {
					lat: location.lat(),
					lon: location.lng(),
					radius: 200
				}
			}).then(function (res, err) {
				console.log(res);
				console.log(err);

				$scope.mymarker = new google.maps.Marker({
					map: $scope.map,
					animation: google.maps.Animation.DROP,
					position: $scope.map.getCenter(),
					title: 'xd'
				});
			});
		}

		$scope.initPage();

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
			$scope.activeLink = 'people';
		};
	}]);