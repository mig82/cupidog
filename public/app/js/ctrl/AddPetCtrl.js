"use strict";

angular.module('cupidog').controller('AddPetCtrl', ['$scope', '$http', '$state', 'SessionSrv', 'CommonsSrv', function($scope, $http, $state, SessionSrv, CommonsSrv){

	var user = SessionSrv.getUser();	

	if(!$scope.pet){
		$scope.pet = {};
	}

	/*Define how to get the species options and get them right away.*/
	$scope.getSpecies = function(){
		$http.get("/api/species").success(function(res){
			$scope.species = res;
		});
	};
	$scope.getSpecies();

	/*Define how to get the breed options but do NOT get them right away.*/
	$scope.getBreeds = function(){
		$http.get("/api/breeds?sp=" + $scope.pet.sp).success(function(res){
			$scope.breeds = res;
		});
	};

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

	$scope.addPet = function(){
		//$scope.pet.profilePic = "img/icons/nopic_" + $scope.pet.sp + ".svg";
		$scope.pet.profilePic = "img/icons/" + $scope.pet.sp + "-ico.svg";
		$scope.pet.spIco = "#" + $scope.pet.sp + "-ico";
		$scope.pet._user = user._id;
		
		console.log("Requesting POST for pet %o with owner %o", $scope.pet, user);

		$http.post("/api/pets", $scope.pet).success(function(res){
			console.log("created %o", res);
			$scope.pet = {};
			$scope.gotoPets();
		});
	};

	$scope.gotoPets = function(){
		$state.go('main.pets');
	};

}]);


	