"use strict";
angular.module('cupidog').controller('PetPanelCtrl', ['$scope', 'SessionSrv', function($scope, SessionSrv){

	$scope.savePetStatus = function(pet){
		console.log("PetPanelCtrl will save %o", pet.status);
		SessionSrv.updatePetStatus(pet);
	}

}]);


	