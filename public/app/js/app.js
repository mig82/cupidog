
"use strict";

var app = angular.module('cupidog', ['ngRoute', 'mgcrea.ngStrap', 'ui.router', 'ngResource'])

//.config(['$routeProvider', function($routeProvider) {
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/login");

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
		url: "/main?access_token",
		templateUrl: "views/main.html",
		controller: function($rootScope, $stateParams) {
			console.log("0) Received access_token %o", $stateParams.access_token);
			$rootScope.token = $stateParams.access_token;
		}
	})

	.state('unknown', {
		url: "/unknown",
		templateUrl: "views/unknown.html"
	})

	.state('main.home', {
		url: "/home",
		templateUrl: "views/home.html",
	})

	.state('main.pets', {
		url: "/pets",
		templateUrl: "views/pets.html" 
	})

	.state('main.pethome', {
		url: "/pethome",
		templateUrl: "views/pet-home.html" 
	})

	.state('main.addpet', {
		url: "/addpet",
		/*templateUrl: "views/addpet.html"*/
		templateUrl: "views/update-pet.html",
		controller: "UpdatePetCtrl"
	})

	.state('main.updatePet', {
		url: "/updatepet",
		templateUrl: "views/update-pet.html",
		controller: "UpdatePetCtrl"
	})

}])

//.run(['$rootScope', '$location', 'SessionSrv', function ($rootScope, $location, SessionSrv) {
.run(['$rootScope', '$state', '$urlRouter', '$stateParams', 'SessionSrv', function ($rootScope, $state, $urlRouter, $stateParams, SessionSrv) {

	var publicRoutes = ['/login', '/main'];

	// check if current location matches a public route  
	var isPublic = function ( route ) {
		return _.find(publicRoutes, function (publicRoute) {
				//return _.str.startsWith(route, publicRoute);
				return (route.indexOf(publicRoute) === 0);
		});
	};

	//$rootScope.$on('$routeChangeStart', function (event, next, current) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

		//event.preventDefault(); // Halt state change from even starting

		// if route requires auth and user is not logged in
		if(!isPublic(toState.url)){
			console.log("4) Need login");
			SessionSrv.getUser().then(function(user){
				console.log("5) user is %o", user);
				if(!user){
					console.log("6) Can't access %o without login", toState.url);
					$state.go('login');
				}
			});
		}
		else{
			$state.go(toState);
		}

	});
	
	console.log('Starting CupiDog...');

	//gettextCatalog.setCurrentLanguage('en');
	//gettextCatalog.debug = true;
}]);
