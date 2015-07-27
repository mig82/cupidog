"use strict";
angular.module('cupidog').controller('PetsCtrl', ['$scope', '$http', '$state', 'SessionSrv', function($scope, $http, $state, SessionSrv){

	$scope.user = SessionSrv.getUser();

	if($scope.user){
		$http.get("/api/pets?user=" + $scope.user._id).success(function(res){
			$scope.user.pets = res;
		});
	}

	$scope.gotoUpdate = function(pet){
		console.log("go to update pet %o", pet);
		SessionSrv.setPet(pet);
		$state.go('main.updatePet');
	}
}]);


	