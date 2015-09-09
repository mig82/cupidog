"use strict";
angular.module('cupidog').factory('RestCliSrv', ['$http', '$rootScope', 'ConfigSrv', function($http, $rootScope, ConfigSrv){

	var _token; //String
	var nodeServerUrl; //String
	
	ConfigSrv.getConfig().then(function(config){
		nodeServerUrl = config.nodeServerUrl;
	})
	
	/* Remember:
		$http.get(...)
		.success(function(data, status, headers, config).
		.error(function(data, status, headers, config)
	*/

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
			return $http.get( nodeServerUrl + "/api/users?access_token=" + this.getToken() ).success(function(res){
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
			return $http.get( nodeServerUrl + "/api/users/" + userId + "?password=" + password ).success(function(res){
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
			return $http.get( nodeServerUrl + "/api/pets?user=" + userId + "&access_token=" + this.getToken() ).success(function(res){
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
			return $http.get( nodeServerUrl +  "/api/species?access_token=" + this.getToken() ).success(function(res){
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
			return $http.get( nodeServerUrl + "/api/breeds?access_token=" + this.getToken() + "&sp=" + species).success(function(res){
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
			return $http.post( nodeServerUrl + "/api/pets?access_token=" + this.getToken(), pet).success(function(res){
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
			return $http.put( nodeServerUrl + "/api/pets/" + pet._id + "?access_token=" + this.getToken() , pet).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli Error savePet %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},

		getPosts: function(pet){

			var url = "";

			if(pet){
				url =  nodeServerUrl + "/api/pets/" + pet._id + "/posts/";
			}
			else{
				url =  nodeServerUrl + "/api/posts";
			}

			return $http.get( url.concat( "?access_token=" + this.getToken() ) ).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli Error getPosts %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},

		createPetPost: function(user, pet){

			pet.status._userAuthor = user._id;
			pet.status._petAuthor = pet._id;
			pet.status.userAuthorName = user.displayName?user.displayName:user.name;
			pet.status.petAuthorName = pet.name;

			return $http.post( nodeServerUrl + "/api/pets/" + pet._id + "/posts/?access_token=" + this.getToken(), pet.status).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli Error updatePetStatus %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},

		findPhotos: function(pet){
			return $http.get( nodeServerUrl + "/api/pets/" + pet._id + "/photos/?access_token=" + this.getToken() ).success(function(res){
				return res;
			}).error(function(res, status){
				console.error("REST Cli Error getPhotos %s: %o", status, res);
				return res;
			}).then(function(res){
				//This just separates the actual data from the http response object so that the logic layer can be protocol agnostic.
				return res.data 
			});
		},

		/*postPhotos: function(pet, photos){

			console.log("Sending photos %o", photos);
			return $http.post( nodeServerUrl + "/api/pets/" + pet._id + "/photos/", photos, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			})
			.success(function(d){
				console.log("Success uploading %o", d);
			});
		},*/
	};
}]);

