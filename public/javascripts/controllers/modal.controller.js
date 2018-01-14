angular.module('app')
.controller('modalController', ['selectedRestaurant', 'isLoggedIn', 'user', '$scope', '$rootScope','$uibModal', '$uibModalInstance', '$http',
	function(selectedRestaurant, isLoggedIn, user, $scope, $rootScope, $uibModal, $uibModalInstance, $http) {
		$scope.didUserSubmit = false;
		$scope.showErrors = false;
		$scope.showSuccess = false;
		$scope.reservationError = "";
		$scope.startTime = null;
		$scope.endTime = null;
		$scope.user = null;
		$scope.isLoggedIn = false;
		$scope.noUsers = true;
		$scope.users = [];

		$scope.restaurant = selectedRestaurant;

		$scope.close = function() {
			$uibModalInstance.close();
		};

		$scope.loadUsers = function() {
			$scope.noUsers = false;
			if ($scope.restaurant != null) {
				var params = {
					address: $scope.restaurant.location.address1
				};

				$http.get('post/address/' + params.address).success(function(data) {
					console.log(data);
					$scope.users = data;
					$scope.noUsers = (data.length === 0);
				}, function(err) {
					$scope.noUsers = true;
					console.log(err);
				});
			}
		}

		$scope.submit = function() {
			$scope.didUserSubmit = true;
			$scope.showErrors = false;
			$scope.showSuccess = false;

			if ($scope.endTime >= $scope.startTime) {
				$scope.didUserSubmit = false;
				$scope.showErrors = true;
				$scope.errorMessage = "End time must be greater than start time"
			}

			var request = {
				address: $scope.restaurant.location.address1,
				startTime: $scope.startTime,
				endTime: $scope.endTime
			};

			$http.post('/add-outing', request).success(function(data) {
				if (data.state === 'success') {
					$scope.didUserSubmit = false;
					$scope.showSuccess = true;
				} else {
					$scope.didUserSubmit = false;
					$scope.showErrors = true;
					$scope.reservationError = "An error occured. Please try again."
				}
			}, function(err) {
				console.log(err);
				$scope.didUserSubmit = false;
				$scope.showErrors = true;
				$scope.reservationError = "An error occured. Please try again."
			});
		};

		$scope.authFacebook = function() { window.location="http://localhost:3000/auth/facebook" }

		$scope.login = function() {
			$scope.authFacebook();
		}

		$scope.loadUsers();
	}]);