(function(){
	function indexOf2(array, item, start, property) {
		var l = array.length;
		for (var i = start; i < l; i++) {
			if(array[i][property] === item)
			return i;
		};
		return -1;
	}

	if(!Array.prototype.indexOf2){
		Array.prototype.indexOf2 = function(item, start, property){
			return indexOf2(this, item, start, property);
		};
	}
})();