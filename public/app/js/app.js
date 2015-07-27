
"use strict";

var app = angular.module('cupidog', ['ngRoute', 'mgcrea.ngStrap', 'ui.router'])

//.config(['$routeProvider', function($routeProvider) {
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/unknown");

	// Now set up the states
	$stateProvider
	
	.state('login', {
		url: "/login",
		templateUrl: "views/login.html"
	})

	.state('about', {
		url: "/about",
		templateUrl: "views/about.html" 
	})

	.state('main', {
		url: "/main",
		templateUrl: "views/main.html"
	})

	.state('unknown', {
		url: "/unknown",
		templateUrl: "views/unknown.html"
	})

	.state('main.home', {
		url: "/home",
		templateUrl: "views/home.html" 
	})

	.state('main.pets', {
		url: "/pets",
		templateUrl: "views/pets.html" 
	})

	.state('main.addpet', {
		url: "/addpet",
		templateUrl: "views/addpet.html" 
	})

	.state('main.updatePet', {
		url: "/updatepet",
		templateUrl: "views/update-pet.html",
		controller: "UpdatePetCtrl"
	})

}])

//.run(['$rootScope', '$location', 'SessionSrv', function ($rootScope, $location, SessionSrv) {
.run(['$rootScope', '$state', '$urlRouter', 'SessionSrv', function ($rootScope, $state, $urlRouter, SessionSrv) {

	var publicRoutes = ['/login', '/unauth', '/notfound'];

	// check if current location matches a public route  
	var isPublic = function ( route ) {
		return _.find(publicRoutes, function (publicRoute) {
				//return _.str.startsWith(route, publicRoute);
				return (route.indexOf(publicRoute) === 0);
		});
	};

	//$rootScope.$on('$routeChangeStart', function (event, next, current) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		
		// Halt state change from even starting
		//event.preventDefault();
		
		console.log("state transition to %o", toState);

		// if route requires auth and user is not logged in
		if (!isPublic(toState.url) && !SessionSrv.isLoggedIn()) {
		//if(false){ //IMPORTANT: For development only	
			console.log("Can't access %o without login", toState.url);
			//$location.path('/login'); // redirect back to login
			$state.go('login');
			//$urlRouter.sync();
		}
		else{
			$state.go(toState); // Continue with the update and state transition
		}

	});

	/*$rootScope.$on('$routeChangeStart', function (event, next, current) {
		// if route requires auth and user is not logged in
		if (!isPublic($location.url()) && !SessionSrv.isLoggedIn()) {
			// redirect back to login
			$location.path('/login');
		}
	});*/
	
	console.log('Starting CupiDog...');

	//gettextCatalog.setCurrentLanguage('en');
	//gettextCatalog.debug = true;
}]);
