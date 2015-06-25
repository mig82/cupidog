
var app = angular.module('cupidog', ['ngRoute', 'mgcrea.ngStrap'])

.config(['$routeProvider', function($routeProvider) {
	
	"use strict";

	$routeProvider.when('/home', {
		templateUrl: 'views/home.html',
		//controller: "BeginController"
	});

	$routeProvider.when('/pets', {
		templateUrl: 'views/pets.html',
	});

	$routeProvider.when('/addpet', {
		templateUrl: 'views/addpet.html',
	});
	
	$routeProvider.otherwise({ redirectTo: '/home' });

}])

.run(function(){
	
	console.log('Starting CupiDog...');

	//gettextCatalog.setCurrentLanguage('en');
	//gettextCatalog.debug = true;
});
