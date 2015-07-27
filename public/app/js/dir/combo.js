"use strict";
angular.module('cupidog').directive('combo', ['$filter', '$timeout', function($filter, $timeout){
	// Runs during compile

	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// {} = isolate, true = child, false/undefined = no change
		scope: {
			model: '=',
			required: '=',
			placeholder: '=',
			options: '=',
		},
		// controller: function($scope, $element, $attrs, $transclude) {},
		//require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'dir/combo.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {

			$scope.focus = false;

			$scope.toggleOptions = function(focus){
				$timeout(function() {
					$scope.focus = focus;
				}, 200);
			};

			$scope.setValue = function(newValue){
				$scope.model = newValue;
				$scope.focus = false;
			};
		}
	};
}]);