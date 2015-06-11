angular.module('cupidog').controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){

	"use strict";

	$http.get("/pets").success(function(res){
		$scope.user = res;
	});



	$scope.gotoSomewhere = function(){
		$location.path('/test');
	};

}]);


	