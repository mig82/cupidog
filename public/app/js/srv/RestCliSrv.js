"use strict";
angular.module('cupidog').factory('RestCliSrv', ['$http', '$rootScope', function($http, $rootScope){

	var _token; //String

	/* Remember:
		$http.get(...)
		.success(function(data, status, headers, config).
		.error(function(data, status, headers, config)*/

	return {
		
		setToken: function(token){
			_token = token;
		},

		getToken: function(){
			if(!_token){_token = $rootScope.token}
			return _token;
		},

		getUser: function(){
			console.log("Requesting user with token %s", this.getToken());
			return $http.get( "/api/users?access_token=" + this.getToken() ).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli getUser Error %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},

		getUserByUserPassword: function(userId, password){
			return $http.get("/api/users/" + userId + "?password=" + password ).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli getUserByUserPassword Error %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},

		getPets: function(userId){
			return $http.get("/api/pets?user=" + userId + "&access_token=" + this.getToken() ).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli Error getPets %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},

		getSpecies: function(){
			return $http.get( "/api/species?access_token=" + this.getToken() ).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli Error getSpecies %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},

		getBreeds: function(species){
			return $http.get("/api/breeds?access_token=" + this.getToken() + "&sp=" + species).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli Error getBreeds %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},

		createPet: function(pet){
			return $http.post("/api/pets?access_token=" + this.getToken(), pet).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli Error savePet %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},

		updatePet: function(pet){
			return $http.put("/api/pets/" + pet._id + "?access_token=" + this.getToken() , pet).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli Error savePet %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},

		getPosts: function(){
			return $http.get( "/api/posts?access_token=" + this.getToken() ).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli Error getPosts %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},

		createPost: function(post){
			return $http.post("/api/posts?access_token=" + this.getToken(), post).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli Error createPost %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},
	};
}]);

