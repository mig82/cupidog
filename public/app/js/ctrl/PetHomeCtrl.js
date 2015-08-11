"use strict";
angular.module('cupidog').controller('PetHomeCtrl', ['$scope', 'SessionSrv', 'NavigationSrv', function($scope, SessionSrv, NavigationSrv){

	$scope.pet = SessionSrv.getPet();

	$scope.gotoUpdate = function(pet){
		SessionSrv.setPet(pet);
		NavigationSrv.gotoUpdatePet();
	};

}]);


	