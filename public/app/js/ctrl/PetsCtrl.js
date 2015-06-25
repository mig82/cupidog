angular.module('cupidog').controller('PetsCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){

	"use strict";

	$http.get("/pets").success(function(res){
		$scope.user = res;
	});


}]);


	