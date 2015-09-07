"use strict";
angular.module('cupidog').controller('UserCtrl', ['$scope', '$http', '$location', 'SessionSrv', function($scope, $http, $location, SessionSrv){

	SessionSrv.getUser().then(function(user){
		$scope.user = user;
	});


	var navbarMenuClass = "navbar-menu";
	$scope.navbarMenuClass = navbarMenuClass;
	$scope.toggleMenu = function(){
		if($scope.navbarMenuClass)
			$scope.navbarMenuClass = "";
		else
			$scope.navbarMenuClass = navbarMenuClass;
	};

}]);


	