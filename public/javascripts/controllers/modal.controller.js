angular.module('app')
.controller('modalController', ['selectedRestaurant', '$scope', '$rootScope','$uibModal', '$uibModalInstance', '$http',
	function(selectedRestaurant, $scope, $rootScope, $uibModal, $uibModalInstance, $http) {
		$scope.didUserSubmit = false;
		$scope.showErrors = false;
		$scope.showSuccess = false;
		$scope.reservationError = "";
		$scope.startTime = null;
		$scope.endTime = null;

		$scope.restaurant = selectedRestaurant;
		console.log($scope.restaurant);

		$scope.close = function() {
			$uibModalInstance.close();
		};

		$scope.submit = function() {
			$scope.didUserSubmit = true;
			$scope.showErrors = false;
			$scope.showSuccess = false;
		};
	}]);