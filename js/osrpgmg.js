
function osrpgmg_init() {

	var no_cache = Math.floor(new Date().getTime() / 1000); // unix timestamp

	var ctx = document.getElementById('osrpgmg').getContext('2d');
	var hm_ctx = document.getElementById('osrpgmg_heightmap').getContext('2d');
	var pr_ctx = document.getElementById('osrpgmg_preview').getContext('2d');

	var COLS = 128;
	var ROWS = 128;
	var T_SIZE = 16;

	var CUTOFF_TERRAIN = 80;
	var CUTOFF_WATER = 50;

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
		preview_render();
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

	            hm_ctx.fillStyle = "rgba(0,0,0,"+(1-(hm_val/99))+")";
				hm_ctx.fillRect( c, r, 1, 1 );
	        }
	    }
	}

	function preview_render(arr) {

		// Use single pixels instead of full tiles
		
	    for (var c = 0; c < COLS; c++) {
	        for (var r = 0; r < ROWS; r++) {

	            var tile = get_tile(visible_map, c, r);

	            var tile_x = tile % 5;
	            var tile_y = Math.floor(tile / 5);
	            
	            pr_ctx.drawImage(
	                tile_img, // image
	                tile_x * T_SIZE, // source x
	                tile_y * T_SIZE, // source y
	                T_SIZE, // source width
	                T_SIZE, // source height
	                c * 2,  // target x
	                r * 2, // target y
	                2, // target width
	                2 // target height
	            );
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

			if(value < CUTOFF_WATER) {
				tile = tiles['water_0000'];
			} else if(value < CUTOFF_TERRAIN) {
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

	    for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {
				// All noise functions return values in the range of -1 to 1.

				// noise.simplex2 and noise.perlin2 for 2d noise
				var value = noise.simplex2(c / 40, r / 40);

				arr.push(Math.round(((value + 1) / 2) * 99));
			}
		}

		return arr;
	}*/

	// Third try, using simplex-noise library
	/*function get_height_map() {

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
	}*/

	// Fourth try, diamond square
	// Never worked right, was diagonal lines
	/*function get_height_map() {

		var init_map = [0,0,0,0];
		var seed = '';

		var iterations = 5;
		var divide = Math.pow(2, iterations);

		//for(i = 0; i < (ROWS/divide)*(COLS/divide); i++) {
		//	var this_rand = Math.round(Math.random() * 99);
		//	init_map.push(this_rand);
		//	seed = seed + '' + pad(this_rand, 2);
		//}

		console.log(seed);

		var ds = new DiamondSquare(init_map,COLS/divide,ROWS/divide,Math.random()*10);

		for(var i = 0; i < iterations; i++ ) {
			ds.iterate();
		}
		
		return ds.dataStore;
	}*/

	function reset_min_max(map) {

		var max = map.reduce(function(a, b) {
		    return Math.max(a, b);
		});

	    var min = map.reduce(function(a, b) {
		    return Math.min(a, b);
		});

	    var new_min = 0;
	    var new_max = max - min;

		var arr = [];

	    for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {

	        	arr.push( (map[c + (r * COLS)] - min) * 99 / new_max );
	        }
	    }

	    return arr;
	}

	// Fifth try, diamond square
	function get_height_map() {

		var terrain = new Terrain(7); // 7 -> 2^7 -> 128, 6 -> 2^6 -> 64
		terrain.generate(1);

		var arr = [];

		for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {
				arr.push(terrain.get(c,r));
			}
		}

		// Set min and max to 0 and 99, recalculate map

	    arr = reset_min_max(arr);

		// Now make edges ocean, with gradual transition

		var center_x = (COLS / 2) - 1;
		var center_y = (ROWS / 2) - 1;

		var land_radius = 40;

		for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {

				var dist = get_dist(center_x, center_y, c, r);

				if(dist > land_radius) {

					var further = dist - land_radius;

					var old_val = arr[ (r * COLS) + c];
					var new_val = old_val * ((40 - (further)) / 40);
					if(new_val < 0 || r == 0 || c == 0 || r == ROWS - 1 || c == COLS - 1) {
						new_val = 0;
					}

					arr[ (r * COLS) + c] = new_val;
				}
			}
		}

		arr = reset_min_max(arr);

		// Get another heightmap, with no island, and combine with original 
		// where meets land, to get more varied mountains

		var terrain_adjust = new Terrain(7); // 7 -> 2^7 -> 128, 6 -> 2^6 -> 64
		terrain_adjust.generate(1);

		var arr_adjust = [];

		for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {
				arr_adjust.push(terrain_adjust.get(c,r));
			}
		}

		arr_adjust = reset_min_max(arr_adjust);

		var arr_2 = [];

		for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {

				first_val = arr[ (r * COLS) + c];
				second_val = arr_adjust[ (r * COLS) + c];

				var new_val = arr[ (r * COLS) + c];

				if(first_val >= CUTOFF_WATER) {

					var diff = second_val - first_val;

					var adjust = diff / 1;

					if(first_val >= CUTOFF_TERRAIN) {
						adjust = diff / 10;
					}

					new_val = first_val + adjust;

					if(new_val < CUTOFF_WATER ) {
						new_val = CUTOFF_WATER;
					}
				}

				arr_2.push(new_val);
			}
		}

		//arr_2 = reset_min_max(arr_2);

	    return arr_2;
	}

	function get_dist(x1, y1, x2, y2) {

		var a = x1 - x2;
		var b = y1 - y2;

		return Math.sqrt( a*a + b*b );
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

