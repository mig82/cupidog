"use strict";
angular.module('cupidog').factory('SessionSrv', ['$q', 'RestCliSrv', function($q, RestCliSrv){

	var _user; //Object
	var _pet; //Object
	var _pets; //Array
	
	return {

		setUser: function(user){
			_user = user;
			console.log("user set to: %o", _user)
		},

		getUser: function(){

			if(!_user){
				console.log("2) SessionSrv _user is undefined, will GET it from server");
				return RestCliSrv.getUser().then(function(user){
					_user = user;
					console.log("3) Session attached to _user %o", _user);
					return _user;
				});
			}
			else{
				console.log("2) SessionSrv _user is already defined");
				return $q.when(_user);
			}
		},

		getUserByUserPassword: function(userId, password){
			if(!_user){
				console.log("SessionSrv _user is undefined");
				return RestCliSrv.getUserByUserPassword().then(function(user){
					_user = user;
					return _user;
				});
			}
			else{
				console.log("SessionSrv _user is already defined");
				return $q.when(_user);
			}
		},
		
		isLoggedIn: function(){
			return (typeof _user != 'undefined');
		},

		setPet: function(pet){
			_pet = pet;
			return $q.when(_pet);
		},

		getPet: function(){
			return _pet
		},

		getPets: function(user){
			if(_user && _user._id)
				return RestCliSrv.getPets(_user._id);
			else
				return $q.when(new Array());
		},

		getSpecies: function(){
			return RestCliSrv.getSpecies();
		},

		getBreeds: function(species){
			if(species && species.length)
				return RestCliSrv.getBreeds(species);
			else
				return $q.when(new Array());
		},

		createPet: function(pet){
			pet.profilePic = "img/icons/" + pet.sp + "-ico.svg";
			pet.spIco = "#" + pet.sp + "-ico";
			pet._user = _user._id;

			return RestCliSrv.createPet(pet).then(function(pet){
				return this.setPet('');
			}.bind(this));
		},

		updatePet: function(pet){
			pet.spIco = "#" + pet.sp + "-ico";
			return RestCliSrv.updatePet(pet).then(function(pet){
				return this.setPet(pet);
			}.bind(this));
		},

		savePetLikes: function(petId, likes){
			return RestCliSrv.savePetLikes(petId, likes).then(function(pet){
				return this.setPet(pet);
			}.bind(this));
		}
	};
}]);