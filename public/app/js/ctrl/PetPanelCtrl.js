"use strict";
angular.module('cupidog').controller('PetPanelCtrl', ['$scope', 'SessionSrv', 'NavigationSrv', function($scope, SessionSrv, NavigationSrv){

	$scope.savePetStatus = function(pet){
		console.log("PetPanelCtrl will save %o", pet.status);
		SessionSrv.updatePetStatus(pet);
	}

	$scope.gotoPhotos = function(pet){
		SessionSrv.setPet(pet);
		NavigationSrv.gotoPhotos();
	}

}]);


	