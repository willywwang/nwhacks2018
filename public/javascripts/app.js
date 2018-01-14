var app = angular.module('app', ['ngRoute', 'ngResource', 'ui.bootstrap', 'moment-picker']);

app.run(['$rootScope', '$http', '$window', '$location',
	function($rootScope, $http, $window, $location) {
	}]);

app.config(['$httpProvider', '$routeProvider', '$locationProvider', function($httpProvider, $routeProvider, $locationProvider)	 {
	$routeProvider.when('/', {
		templateUrl: 'main.html',
		controller: 'mainController'
	})
	.otherwise({redirectTo: '/'})

	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
	$httpProvider.defaults.headers.common["Accept"] = "application/json";
	$httpProvider.defaults.headers.common["Content-Type"] = "application/json";
	$locationProvider.html5Mode(true);
}]);