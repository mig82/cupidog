angular.module('cupidog').factory('SessionSrv', [function(){

	var _user; //Object
	var _pet; //Object

	return {
		
		setUser: function(user){
			_user = user;
			console.log("user set to: %o", _user)
		},

		getUser: function(){
			return _user;
		},
		
		isLoggedIn: function(){
			return (typeof _user != 'undefined');
		},

		setPet: function(pet){
			_pet = pet;
			console.log("pet is set to %o", _pet);
		},

		getPet: function(){
			return _pet
		}
	};
}]);