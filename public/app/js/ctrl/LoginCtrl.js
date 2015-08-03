"use strict";

angular.module('cupidog').controller('LoginCtrl', ['$scope', '$http', '$state', 'SessionSrv', function($scope, $http, $state, SessionSrv){

	$scope.login = function(){

		console.log("Requesting authentication...");

		SessionSrv.getUserByUserPassword().then(function(user){
			
			if(user){
				console.log("Authentication accepted for %o", user);
				$state.go('main.home');
			}
			else{
				console.log("Authentication denied for %o", $scope.user);
				//$location.path('/login');
			}
		});
	};
}]);


	