angular.module('app')
.controller('modalController', ['selectedRestaurant', '$scope', '$rootScope','$uibModal', '$uibModalInstance', '$http',
	function(selectedRestaurant, $scope, $rootScope, $uibModal, $uibModalInstance, $http) {
		$scope.didUserSubmit = false;
		$scope.showErrors = false;
		$scope.showSuccess = false;
		$scope.reservationError = "";

		$scope.restaurant = selectedRestaurant;
		console.log($scope.restaurant);

		$scope.close = function() {
			$uibModalInstance.close();
		};
	}]);