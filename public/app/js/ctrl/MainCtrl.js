"use strict";
angular.module('cupidog').controller('MainCtrl', ['$state', 'SessionSrv', 'NavigationSrv', function($state, SessionSrv, NavigationSrv){

	console.log("1) MainCtrl");
	SessionSrv.getUser().then(function(user){
		NavigationSrv.gotoHome();
	});

}]);


	