"use strict";
angular.module('cupidog').controller('UpdatePetCtrl', ['$scope', 'SessionSrv', 'CommonsSrv', 'NavigationSrv', function($scope, SessionSrv, CommonsSrv, NavigationSrv){

	$scope.updating = NavigationSrv.getMode() === NavigationSrv.MODE_UPDATE;

	$scope.$watch(SessionSrv.getPet() , function(newValue, oldValue){
		$scope.pet = SessionSrv.getPet();
	});
	$scope.pet = SessionSrv.getPet();

	/*Define how to get the species options and get them right away.*/
	SessionSrv.getSpecies().then(function(species){
		$scope.species = species;
	});

	/*Define a function to watch $scope.pet.sp without getting a null pointer when $scope.pet is undefined*/
	function watchSpeciesChange(){
		return $scope.pet?$scope.pet.sp:$scope.pet; 
	}

	/*Define how to get the breed options and get them right away.*/
	function refreshBreeds(){
		SessionSrv.getBreeds( watchSpeciesChange() ).then(function(breeds){
			$scope.breeds = breeds;
		});
	}
	refreshBreeds();

	/*Get the breed options whenever the species changes to a valid value other than the already selected one.*/
	$scope.$watch( watchSpeciesChange , function(newValue, oldValue){
		
		if($scope.pet && $scope.pet.sp){
			if(newValue != oldValue){
				$scope.pet.breed = "";
				refreshBreeds();
			}
		}
		else{
			$scope.breeds = [];
		}
	});

	/*Define the gender options*/
	$scope.genders = CommonsSrv.genders;

	/*Define the year of birth options*/
	$scope.birthYearOpts = CommonsSrv.getYearOpts();

	/*Define how to switch between saving a birth date or just a birth year*/
	$scope.knowsBirthDate = true;
	$scope.toggleBirthOpt = function(){
		$scope.knowsBirthDate = !$scope.knowsBirthDate;
		if($scope.knowsBirthDate){
			$scope.birthYear = "";
		}
		else{
			$scope.birthDate = "";
		}
	};

	function create(){
		return SessionSrv.createPet($scope.pet).then(function(pet){
			$scope.pet = pet;
		});
	}

	function update(){
		return SessionSrv.updatePet($scope.pet).then(function(pet){
			$scope.pet = pet;
		});
	}

	$scope.save = function(){
		if($scope.updating){
			update().then(
			NavigationSrv.gotoListUserPets());
		}
		else{
			create().then(
			NavigationSrv.gotoListUserPets());
		}
	};

	$scope.saveLikes = function(){
		SessionSrv.savePetLikes($scope.pet._id, $scope.pet.likes).then(function(pet){
			$scope.pet = pet;
		});
	};

	$scope.cancel = function(){
		NavigationSrv.gotoListUserPets();
	}
}]);


	