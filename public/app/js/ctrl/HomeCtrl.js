"use strict";
angular.module('cupidog').controller('HomeCtrl', ['$scope', 'SessionSrv', function($scope, SessionSrv){

	SessionSrv.getPosts().then(function(posts){
		$scope.newsfeed = posts;
	});

}]);


	