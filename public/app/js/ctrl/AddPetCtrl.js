angular.module('cupidog').controller('AddPetCtrl', ['$scope', '$http', '$location', '$timeout', '$filter', function($scope, $http, $location, $timeout, $filter){

	"use strict";

	if(!$scope.pet){
		$scope.pet = {};
	}

	$scope.addPet = function(){
		$scope.pet.profilePic = "img/icons/nopic_" + $scope.pet.sp + ".svg";
		$scope.pet.spIco = "#" + $scope.pet.sp + "-ico";
		$http.post("/pets", $scope.pet).success(function(res){
			console.log("created %o", res);
		});
	};

	$scope.getRange = function(min, max){
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
	};

	$scope.species = [
		"dog",
		"cat",
		"mouse",
		"bird",
		"hamster",
		"turtle",
		"tortoise",
		"fish",
		"iguana",
		"huron",
		"horse",
		"chimpanzee",
		"monkey"
	];

	$scope.setSpecies = function(sp){
		$scope.pet.sp = sp;
		$scope.spSearch = "";
	};

	$scope.blankSpecies = function(){
		$scope.pet.sp = "";
	};

	$scope.resetSearch = function(){
		
		var search = $filter('lowercase')($scope.spSearch);
		var i = $scope.species.indexOf(search);
		if(i >= 0){
			$scope.pet.sp = $scope.species[i];
			$scope.spSearch = "";
		}
		else{

			$timeout(function(){
				if(!$scope.pet.sp){
					$scope.spSearch = "";
				}
			}, 200);
		}

		
		
	};

}]);


	