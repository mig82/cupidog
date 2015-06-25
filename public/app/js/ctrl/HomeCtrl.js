angular.module('cupidog').controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){

	"use strict";

	$scope.gotoSomewhere = function(){
		$location.path('/test');
	};

}]);


	