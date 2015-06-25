angular.module('cupidog').controller('AddPetCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){

	"use strict";

	if(!$scope.pet){
		$scope.pet = {};
	}

	$scope.addPet = function(){
		console.log("creating new pet %o", $scope.pet);

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
		"fish",
		"iguana",
		"huron",
		"horse"
	];

	$scope.setSpecies = function(sp){
		$scope.pet.sp = sp;
		$scope.spSearch = "";
	};

}]);


	