"use strict";
angular.module('cupidog').controller('UserCtrl', ['$scope', '$http', '$location', 'SessionSrv', function($scope, $http, $location, SessionSrv){

	SessionSrv.getUser().then(function(user){
		$scope.user = user;
	});

}]);


	