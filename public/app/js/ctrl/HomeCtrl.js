"use strict";
angular.module('cupidog').controller('HomeCtrl', ['$rootScope', '$scope', '$http', '$location', 'SessionSrv', function($rootScope, $scope, $http, $location, SessionSrv){

	$scope.gotoSomewhere = function(){
		$location.path('/test');
	};

}]);


	