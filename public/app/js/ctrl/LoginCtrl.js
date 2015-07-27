"use strict";

angular.module('cupidog').controller('LoginCtrl', ['$scope', '$http', '$state', 'SessionSrv', function($scope, $http, $state, SessionSrv){

	$scope.login = function(){

		console.log("Requesting authentication...");

		$http.get("/api/users/" + $scope.email + "?password=" + $scope.password ).success(function(res){
			
			if(res){
				console.log("Authentication accepted for %o", res);
				//$scope.user = res;
				SessionSrv.setUser(res);
				$state.go('main.home');
			}
			else{
				console.log("Authentication denied for %o", $scope.user);
				//$location.path('/login');
			}
		});
	};
}]);


	