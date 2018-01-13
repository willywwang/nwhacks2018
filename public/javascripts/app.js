var app = angular.module('app', ['ngRoute', 'ngResource', 'ui.bootstrap']);

app.run(['$rootScope', '$http', '$window', '$location',
	function($rootScope, $http, $window, $location) {
	}]);

app.config(function($routeProvider, $locationProvider)	 {
	$routeProvider.when('/', {
		templateUrl: 'main.html',
		controller: 'mainController'
	})
	.otherwise({redirectTo: '/'})

	$locationProvider.html5Mode(true);
});