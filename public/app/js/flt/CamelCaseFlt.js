angular.module('cupidog').filter('camelcase', function() {
	return function(text) {

		if(!text) return '';

		return text.replace(/\W+(.)/g, function (x, chr) {
			return chr.toUpperCase();
		});
	};
});
/*
angular.module('cupidog').filter('dashToCamel', function() {
	return function(text) {
		return text.replace(/\W+/g, '-')
				.replace(/([a-z\d])([A-Z])/g, '$1-$2');
	};
});

angular.module('cupidog').filter('dashToWhiteSpace', function() {
	return function(text) {
		return text.replace(/\W+/g, '-')
				.replace(/([a-z\d])([A-Z])/g, '$1-$2');
	};
});
*/