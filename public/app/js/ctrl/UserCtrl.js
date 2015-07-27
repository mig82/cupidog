"use strict";
angular.module('cupidog').controller('UserCtrl', ['$scope', '$http', '$location', 'SessionSrv', function($scope, $http, $location, SessionSrv){

	$scope.user = SessionSrv.getUser();

}]);


	