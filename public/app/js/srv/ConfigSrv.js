angular.module('cupidog').factory('ConfigSrv', ['$q', function($q){

	var config;

	var _getConfig = function(){
		//console.log("2 Config");
		if(config){
			//console.log("3 Config from cache");
			return $q.when(config);
		}
		else{
			//console.log("3 Config from file");
			return _loadDefaultConfig("/app/config/default_config.json").then(function(data){
				config = data;
				return config;
			});
		}
	};

	var _loadDefaultConfig = function(fileName){

		return new Promise(function(resolve, reject)
		{
			// do a thing, possibly async, then…
			var defaultConfig;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", fileName, true);

			//xhr.onreadystatechange = function() {
			xhr.onload = function() {
				
				if (xhr.status == 200) {
					defaultConfig = JSON.parse(xhr.responseText);
					console.info('default config is %o', defaultConfig);
					resolve(defaultConfig);
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