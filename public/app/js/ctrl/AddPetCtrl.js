angular.module('cupidog').controller('AddPetCtrl', ['$scope', '$http', '$location', '$timeout', '$filter', function($scope, $http, $location, $timeout, $filter){

	"use strict";

	if(!$scope.pet){
		$scope.pet = {};
	}

	$scope.genderFocus = false;
	$scope.genders = {
		f: "Female",
		m: "Male"
	};

	$scope.toggleOptions = function(focus){
		$timeout(function() {
			$scope.genderFocus = focus;
		}, 200);
	};

	$scope.setGender = function(gender){
		$scope.pet.gender = gender;
		$scope.genderFocus = false;
	};

	$scope.addPet = function(){
		//$scope.pet.profilePic = "img/icons/nopic_" + $scope.pet.sp + ".svg";
		$scope.pet.profilePic = "img/icons/" + $scope.pet.sp + "-ico.svg";
		$scope.pet.spIco = "#" + $scope.pet.sp + "-ico";
		
		$http.post("/pets", $scope.pet).success(function(res){
			console.log("created %o", res);
			$scope.pet = {};
			$scope.gotoPets();
		});
	};

	/*$scope.getRange = function(min, max){
		var range = [];
		for (var i = min; i <= max; i++) {
			range.push(i);
		};
		return range;
	};

	$scope.getYearOpts = function(){
		var range = [];
		var today = new Date();
		var max =  1900 + today.getYear();
		var span = 15;
		var min = max -span;
		return this.getRange(min, max);
	};*/

	$scope.getSpecies = function(){
		$http.get("/species").success(function(res){
			$scope.species = res;
		});
	};
	$scope.getSpecies();

	$scope.getBreeds = function(){
		console.log("searching breeds");
		$http.get("/breeds?sp=" + $scope.pet.sp).success(function(res){
			$scope.breeds = res;
		});
	};

	$scope.setSpecies = function(sp){
		if(sp != $scope.pet.sp){
			$scope.pet.sp = sp;
			$scope.pet.breed = "";
			$scope.getBreeds();
		}
		$scope.spSearch = "";
	};

	$scope.setBreed = function(breed){
		$scope.pet.breed = breed;
		$scope.breedSearch = "";
	};

	$scope.blankSpecies = function(){
		$scope.pet.sp = "";
	};

	$scope.blankBreed = function(){
		$scope.pet.breed = "";
	};

	$scope.resetSpeciesSearch = function(){
		var search = $filter('lowercase')($scope.spSearch);
		var i = $scope.species.indexOf2(search, 0, "desc");
		if(i >= 0){
			$scope.setSpecies($scope.species[i].desc);
		}
		else{
			$timeout(function(){
				if(!$scope.pet.sp){
					$scope.spSearch = "";
				}
			}, 200);
		}
	};

	$scope.resetBreedSearch = function(){
			var search = $filter('lowercase')($scope.breedSearch);
			var i = $scope.breeds?$scope.breeds.indexOf2(search, 0, "desc"):-1;
			if(i >= 0){
				$scope.pet.breed = $scope.breeds[i].desc;
				$scope.breedSearch = "";
			}
			else{
				$timeout(function(){
					if(!$scope.pet.breed){
						$scope.breedSearch = "";
					}
				}, 200);
			}
	};

	$scope.gotoPets = function(){
		$location.path('/pets');
	};

}]);


	