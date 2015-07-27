
"use strict";
angular.module('cupidog').directive('typeahead', ['$filter', '$timeout', function($filter, $timeout){
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
			optLabel: '=', //The property in each option that will be displayed in the autocomplete suggestions.
			optSearch: '=', //The property in each option that must match the typed-in search.
			optValue: '=' //The property in each option that will be assigned to the model in case of a match.
		},
		// controller: function($scope, $element, $attrs, $transclude) {},
		//require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'dir/typeahead.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {

			$scope.searchQuery = "";
			$scope.temp = "";

			$scope.focus = function(){
				$scope.temp = $scope.model;
				$scope.model = "";
				
				$timeout(function() {
					iElm[0].children[2].focus();
				}, 10);
			};

			$scope.blur = function(){
				var search = $filter('lowercase')($scope.searchQuery);
				//var i = $scope.options.indexOf2(search, 0, "desc");
				var selectedOpt = _.find($scope.options, function(opt){
					return opt[$scope.optSearch] == search;
				});
				
				//If the newly typed-in value matches one of the accepted options, then set the model's value to the corresponding option's value.
				//if(i >= 0){
				if(selectedOpt){
					//$scope.setValue($scope.options[i].desc);
					$scope.setValue(selectedOpt[$scope.optValue]);
				}
				else{

					//Use a timeout to allow for the click event to fire because this function is fired on blur.
					$timeout(function(){
						if(!$scope.model ||  (typeof $scope.model == 'string' && $scope.model.trim() == "" ) ){
							$scope.searchQuery = "";
							$scope.model = $scope.temp; //If the model had a valid value before typing in, then restore it.
						}
					}, 200);
				}
			};

			$scope.setValue = function(newValue){
				if(newValue != $scope.model){
					$scope.model = newValue;
					//$scope.model.breed = "";
					//$scope.getBreeds();
				}
				$scope.searchQuery = "";
			};


		}
	};
}]);