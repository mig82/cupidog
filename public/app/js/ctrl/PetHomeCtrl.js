"use strict";
angular.module('cupidog').controller('PetHomeCtrl', ['$scope', 'SessionSrv', 'NavigationSrv', '$sce', '$resource', function($scope, SessionSrv, NavigationSrv, $sce){

	$scope.pet = SessionSrv.getPet();

	var gmapsUrl = "https://www.google.com/maps/embed/v1/place?";
	$scope.gmapsUrl = gmapsUrl.concat(
		"q=", $scope.pet.loc.addr,
		"&zoom=6",
		"&key=AIzaSyBqNwJjGnmVqHMrBpMsUl7lHutzp7gqIoc"
	);
	
	$scope.trustUrl = function(url) {
		console.log(url);
		return $sce.trustAsResourceUrl(url);
	}

	$scope.gotoUpdate = function(pet){
		SessionSrv.setPet(pet);
		NavigationSrv.gotoUpdatePet();
	};

	SessionSrv.getPosts($scope.pet).then(function(posts){
		$scope.newsfeed = posts;
	});

}]);


	