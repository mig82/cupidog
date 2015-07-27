angular.module('cupidog').factory('CommonsSrv', [function(){

	return {
		
		getRange: function(min, max){
			var range = [];
			for (var i = min; i <= max; i++) {
				range.push(i);
			};
			return range;
		},

		getYearOpts: function(){
			var range = [];
			var today = new Date();
			var max =  1900 + today.getYear();
			var span = 15;
			var min = max -span;
			return this.getRange(min, max);
		},

		genders: {
			f: "Female",
			m: "Male"
		}
	};
}]);