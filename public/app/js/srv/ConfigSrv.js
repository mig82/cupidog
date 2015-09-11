angular.module('cupidog').factory('ConfigSrv', ['$q', function($q){

	var config;
	var configFilePath = "/app/config/webapp_config.json";

	var _getConfig = function(){
		//console.log("2 Config");
		if(config){
			console.log("3 Config from cache");
			return $q.when(config);
		}
		else{
			console.log("3 Config from file %s", configFilePath);
			return _loadDefaultConfig( configFilePath ).then(function(data){
				config = data;
				return config;
			});
		}
	};

	var _loadDefaultConfig = function(fileName){

		return new Promise(function(resolve, reject)
		{
			// do a thing, possibly async, then…
			var config;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", fileName, true);

			//xhr.onreadystatechange = function() {
			xhr.onload = function() {
				
				if (xhr.status == 200) {
					config = JSON.parse(xhr.responseText);
					console.info('WebApp config is %o', config);
					resolve(config);
				}
				else{
					console.error("Error loading default data");
					reject(Error(xhr.statusText));
				}
			};

			// Handle network errors
			xhr.onerror = function() {
				reject(Error("Network Error"));
			};

			xhr.send();

		});
	};

	return {
		getConfig: _getConfig
	};
}]);