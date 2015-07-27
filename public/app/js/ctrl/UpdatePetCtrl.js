"use strict";
angular.module('cupidog').controller('UpdatePetCtrl', ['$scope', '$http', '$state', 'SessionSrv', 'CommonsSrv', function($scope, $http, $state, SessionSrv, CommonsSrv){

	$scope.$watch(SessionSrv.getPet() , function(newValue, oldValue){
		$scope.pet = SessionSrv.getPet();
	});
	$scope.pet = SessionSrv.getPet();

	/*Define how to get the species options and get them right away.*/
	$scope.getSpecies = function(){
		$http.get("/api/species").success(function(res){
			$scope.species = res;
		});
	};
	$scope.getSpecies();

	/*Define how to get the breed options and get them right away if a species is already selected.*/
	$scope.getBreeds = function(){
		$http.get("/api/breeds?sp=" + $scope.pet.sp).success(function(res){
			$scope.breeds = res;
		});
	};
	if($scope.pet && $scope.pet.sp){
		$scope.getBreeds();
	}

	/*Get the breed options whenever the species changes to a valid value other than the already selected one.*/
	$scope.$watch( function(){
		return $scope.pet?$scope.pet.sp:$scope.pet; 
	}, function(newValue, oldValue){
		
		if($scope.pet && $scope.pet.sp){
			if(newValue != oldValue){
				$scope.pet.breed = "";
				$scope.getBreeds();
			}
		}
		else{
			$scope.breeds = [];
		}
	});

	/*Define the gender options*/
	$scope.genders = CommonsSrv.genders;
	$scope.birthYearOpts = CommonsSrv.getYearOpts();

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

	$scope.save = function(){

		console.log("Save changes to %o", $scope.pet);

		$http.put("/api/pets/" + $scope.pet._id, $scope.pet).success(function(res){
			SessionSrv.setPet(res);
		});
	};

	$scope.saveLikes = function(){

		console.log("Save likes to %o", $scope.pet);

		$http.put("/api/pets/" + $scope.pet._id + "/likes", $scope.pet.likes).success(function(res){
			SessionSrv.setPet(res);
		});
	};

	$scope.cancel = function(){
		$state.go('main.pets');
	}
}]);


	