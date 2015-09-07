"use strict";
angular.module('cupidog').factory('NavigationSrv', ['$state', '$stateParams', function($state, $stateParams){

	var MODE_UPDATE = 'update';
	var MODE_CREATE = 'create';

	var _mode = '';

	return {

		MODE_UPDATE: angular.copy(MODE_UPDATE),
		MODE_CREATE: angular.copy(MODE_CREATE),

		getMode: function(){
			return _mode;
		},

		gotoHome: function(){
			$state.go('main.home');
		},

		gotoUpdatePet: function(){
			_mode = MODE_UPDATE;
			$state.go('main.updatePet');
		},

		gotoCreatePet: function(){
			_mode = MODE_CREATE;
			$state.go('main.updatePet');
		},

		gotoListUserPets: function(){
			$state.go('main.pets');
		},

		gotoPetHome: function(){
			$state.go('main.pethome');
		},

		gotoPhotos: function(){
			$state.go('main.photos');
		},
	};
}]);