"use strict";
angular.module('cupidog').controller('PetsCtrl', ['$scope', 'SessionSrv', 'NavigationSrv', function($scope, SessionSrv, NavigationSrv){

	SessionSrv.getUser().then(function(user){
		$scope.user = user;
		return user;
	}).then(function(user){
		if(user){
			SessionSrv.getPets(user).then(function(pets){
				$scope.pets = pets;
			})
		}
	});

	$scope.gotoUpdate = function(pet){
		SessionSrv.setPet(pet);
		NavigationSrv.gotoUpdatePet();
	}

	$scope.gotoCreatePet = function(){
		SessionSrv.setPet('');
		NavigationSrv.gotoCreatePet();
	}
}]);


	