"use strict";
angular.module('cupidog').directive('taglist', ['$filter', '$timeout', function($filter, $timeout){
	// Runs during compile

	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// {} = isolate, true = child, false/undefined = no change
		scope: {
			tags: '=',
			required: '=',
			placeholder: '=',
			options: '=',
		},
		// controller: function($scope, $element, $attrs, $transclude) {},
		//require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'dir/taglist.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {

			$scope.newTag = "";

			$scope.addTag = function(){
		
				if(!$scope.tags){
					$scope.tags = [];
				}

				if($scope.newTag.trim() != "" && !_.contains($scope.tags, $scope.newTag, 0)){
					$scope.tags.push($scope.newTag);
					$scope.newTag = "";
				}
			};

			$scope.removeTag = function(like){
				
				if(!$scope.tags){
					$scope.tags = [];
				}
				else{
					$scope.tags = _.without($scope.tags, like);
				}

				console.log("tags: %o", $scope.tags);
				
			};
			
		}
	};
}]);