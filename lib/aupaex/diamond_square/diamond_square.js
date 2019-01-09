function DiamondSquare(iterations, min_val, max_val, seed) {

	this.size = Math.pow(2, iterations);
	this.min_val = min_val;
	this.max_val = max_val;
	this.map_arr = [
		min_val, min_val,   min_val,   min_val,
		min_val, max_val/2, max_val/2, min_val,
		min_val, max_val/2, max_val/2, min_val,
		min_val, min_val,   min_val,   min_val,
	];

	if(min_val >= max_val) {
		throw Error("Minimum value must be less than maximum value.");
	}

	if(iterations <= 2) {
		throw Error("Iterations must be greater than 2.");
	}
}

DiamondSquare.prototype.generate = function(roughness) {

	for(var i = 2; i < iterations; i++) {

		var new_map = [];

		for(var j = 0; j < this.map_arr.length; j++) {

			
		}
	}
}