
function osrpgmg_init() {

	var no_cache = Math.floor(new Date().getTime() / 1000); // unix timestamp

	var ctx = document.getElementById('osrpgmg').getContext('2d');
	var hm_ctx = document.getElementById('osrpgmg_heightmap').getContext('2d');

	var COLS = 160;
	var ROWS = 120;
	var T_SIZE = 16;

	var tiles = {
		'grass' : 0,
		'flowers' : 1,
		'thick_grass' : 2,
		'thicker_grass' : 3,
		'forest' : 4,
		'swamp' : 5,
		'castle_grass' : 6,
		'town_grass' : 7,
		'castle_sand' : 8,
		'town_sand' : 9,
		'bridge_up_down' : 10,
		'bridge_left_right' : 11,
		'water_0000' : 12,
		'sand_0000' : 13,
		'hill_grass' : 15,
		'mountain_grass' : 16,
		'hill_sand' : 17,
		'mountain_sand' : 18,
		'water_1111' : 20,
		'water_1001' : 21,
		'water_1100' : 22,
		'water_0011' : 23,
		'water_0110' : 24,
		'water_1010' : 25,
		'water_1101' : 26,
		'water_1110' : 27,
		'water_1011' : 28,
		'water_0111' : 29,
		'water_0101' : 30,
		'water_1000' : 31,
		'water_0100' : 32,
		'water_0010' : 33,
		'water_0001' : 34,
		'sand_1111' : 35,
		'sand_1001' : 36,
		'sand_1100' : 37,
		'sand_0011' : 38,
		'sand_0110' : 39,
		'sand_1010' : 40,
		'sand_1101' : 41,
		'sand_1110' : 42,
		'sand_1011' : 43,
		'sand_0111' : 44,
		'sand_0101' : 45,
		'sand_1000' : 46,
		'sand_0100' : 47,
		'sand_0010' : 48,
		'sand_0001' : 49,
	}

	var height_map = get_height_map();

	heightmap_render(height_map);

	var visible_map = visible_map_render(height_map);

	// Load tiles image
	var tile_img = new Image();
	tile_img.onload = function() {
		osrpgmg_render();
	};
	tile_img.src = '/img/old_school_tiles.png';

    function osrpgmg_render() {

    	// Draw map onto canvas
		
		for (var c = 0; c < COLS; c++) {
	        for (var r = 0; r < ROWS; r++) {

	            var tile = get_tile(visible_map, c, r);

	            var tile_x = tile % 5;
	            var tile_y = Math.floor(tile / 5);
	            
	            ctx.drawImage(
	                tile_img, // image
	                tile_x * T_SIZE, // source x
	                tile_y * T_SIZE, // source y
	                T_SIZE, // source width
	                T_SIZE, // source height
	                c * T_SIZE,  // target x
	                r * T_SIZE, // target y
	                T_SIZE, // target width
	                T_SIZE // target height
	            );
	        }
	    }
	}

	function heightmap_render(arr) {

		// Draw heightmap onto smaller canvas
		
	    for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {

	        	var hm_val = arr[c + (r * COLS)];

	            hm_ctx.fillStyle = "rgba(0,0,0,"+(hm_val/99)+")";
				hm_ctx.fillRect( c, r, 1, 1 );
	        }
	    }
	}

	function grass_map() {
		var arr = [];
		for(i = 0; i < COLS * ROWS; i++) {
			arr.push( tiles['water_0000'] );
		}
		return arr;
	}

	function visible_map_render(height_map) {

		var map = [];
		for(i = 0; i < height_map.length; i++) {

			var tile = 0;
			var value = height_map[i];

			if(value < 40) {
				tile = tiles['water_0000'];
			} else if(value < 80) {
				tile = tiles['grass'];
			} else if(value < 85) {
				tile = tiles['hill_grass'];
			} else {
				tile = tiles['mountain_grass'];
			}

			map.push(tile);
		}
		return map;
	}

	// My first try, using my own method
	// 0 to 99 height map
	/*function get_height_map() {

		var arr = [];
		for(i = 0; i < COLS * ROWS; i++) {
			arr.push( -1 );
		}

		// Find mid-point
		var mid = Math.floor(arr.length / 2);

		fill_heightmap(arr, mid, 0, 99);

		return arr;
	}

	function fill_heightmap(arr, loc, low, high) {

		if(arr[loc] == -1) {

			var this_rand = randomIntFromInterval(low,high);
			arr[loc] = this_rand;
			// do neighbors
			var low_rand = this_rand - 1;
			if(low_rand < 0) {
				low_rand = 0;
			}
			var high_rand = this_rand + 1;
			if(high_rand > 99) {
				high_rand = 99;
			}
			fill_heightmap(arr, get_neighbor(arr, loc, 'up'), low_rand,high_rand);
			fill_heightmap(arr, get_neighbor(arr, loc, 'right'), low_rand,high_rand);
			fill_heightmap(arr, get_neighbor(arr, loc, 'down'), low_rand,high_rand);
			fill_heightmap(arr, get_neighbor(arr, loc, 'left'), low_rand,high_rand);
		} else {
			
		}
	}*/

	// Second try, with perlin noise, using library
	/*function get_height_map() {

		noise.seed(Math.random());

		var arr = [];

		for (var c = 0; c < COLS; c++) {
	        for (var r = 0; r < ROWS; r++) {
				// All noise functions return values in the range of -1 to 1.

				// noise.simplex2 and noise.perlin2 for 2d noise
				var value = noise.perlin2(c / 10, r / 10);

				arr.push(Math.round(((value + 1) / 2) * 99));
			}
		}

		return arr;
	}*/

	// Third try, using simplex-noise library
	function get_height_map() {

		var simplex = new SimplexNoise();
		var arr = [];

	    for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {

	        	var value = simplex.noise2D(c / 40, r / 40); // range from -1 to 1
	        	var new_val = Math.round(((value + 1) / 2) * 99); // range from 0 to 99

	        	arr.push(new_val);
	        }
	    }

	    console.log(arr);

	    return arr;
	}

	function get_neighbor(map, val, dir) {

		var new_val = 0;
		var total = ROWS * COLS;

		if(dir == 'up') {
			new_val = val - COLS; // minus one row
			if(new_val < 0) {
				new_val += total;
			}
		} else if(dir == 'down') {
			new_val = val + COLS; // add one row
			if(new_val >= total) {
				new_val -= total;
			}
		} else if(dir == 'left') {
			new_val = val - 1;
			if(Math.floor(new_val / COLS) != Math.floor(val / COLS)) {
				new_val += COLS; // add one row
			}
		} else if(dir == 'right') {
			new_val = val + 1;
			if(Math.floor(new_val / COLS) != Math.floor(val / COLS)) {
				new_val -= COLS; // minus one row
			}
		}
		return new_val;
	}

	function get_tile(map, col, row) {
		return map[ (row * COLS) + col];
	}
}

