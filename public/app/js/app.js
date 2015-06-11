
var app = angular.module('cupidog', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	
	"use strict";

	

	$routeProvider.when('/', {
		templateUrl: 'views/home.html',
		//controller: "BeginController"
	});

	$routeProvider.when('/home', {
		templateUrl: 'views/home.html',
		//controller: "HomeController"
	});

	

	$routeProvider.otherwise({ redirectTo: '/home' });

}])

.run(function(){
	
	console.log('Starting CupiDog...');

	//gettextCatalog.setCurrentLanguage('en');
	//gettextCatalog.debug = true;
});
