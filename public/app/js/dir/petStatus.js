
"use strict";
angular.module('cupidog').directive('petStatus', ['$filter', '$timeout', function($filter, $timeout){
	// Runs during compile

	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// {} = isolate, true = child, false/undefined = no change
		scope: {
			pet: '=',
			placeholder: '=',
			saveStatusFn: '&'
		},
		// controller: function($scope, $element, $attrs, $transclude) {},
		//require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'dir/pet-status.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
			$scope.editing = false;
			if(!$scope.pet.status || typeof $scope.pet.status == 'string')
				$scope.pet.status = {};

			$scope.setEditStatus = function(isEditStatus){
				$timeout(function() { //Timeout is necessary to avoid conflict with on-click event.
					$scope.editing = isEditStatus;

					if (isEditStatus){
						iElm.find("input")[0].focus();
					}
				}.bind(this), 10);
			};

			$scope.saveStatus = function(){
				console.log("saving status");
				//$scope.editing = false;
				$scope.saveStatusFn();
				$scope.setEditStatus(false);
			};

			$scope.showLink = false;
			$scope.showLinkField = function(showLink){
				$scope.showLink = showLink;
			}

		}
	};
}]);