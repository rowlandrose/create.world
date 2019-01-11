
function osrpgmg_init() {

	var no_cache = Math.floor(new Date().getTime() / 1000); // unix timestamp

	var ctx = document.getElementById('osrpgmg').getContext('2d');
	var pr_ctx = document.getElementById('osrpgmg_preview').getContext('2d');

	var COLS = 128;
	var ROWS = 128;
	var T_SIZE = 16;

	var CUTOFF_TERRAIN = 80;
	var CUTOFF_WATER = 50;
	var RIVER_START_MIN_DIST = 5;

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
		'cave_grass' : 14,
		'hill_grass' : 15,
		'mountain_grass' : 16,
		'hill_sand' : 17,
		'mountain_sand' : 18,
		'cave_sand' : 19,
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

	var tile_by_num = swap(tiles);

	var tile_type = {
		'grass' : 'grass',
		'flowers' : 'grass',
		'thick_grass' : 'grass',
		'thicker_grass' : 'grass',
		'forest' : 'grass',
		'swamp' : 'swamp',
		'castle_grass' : 'grass',
		'town_grass' : 'grass',
		'castle_sand' : 'sand',
		'town_sand' : 'sand',
		'bridge_up_down' : 'water',
		'bridge_left_right' : 'water',
		'water_0000' : 'water',
		'sand_0000' : 'sand',
		'cave_grass' : 'grass',
		'hill_grass' : 'grass',
		'mountain_grass' : 'grass',
		'hill_sand' : 'sand',
		'mountain_sand' : 'sand',
		'cave_sand' : 'sand',
		'water_1111' : 'water',
		'water_1001' : 'water',
		'water_1100' : 'water',
		'water_0011' : 'water',
		'water_0110' : 'water',
		'water_1010' : 'water',
		'water_1101' : 'water',
		'water_1110' : 'water',
		'water_1011' : 'water',
		'water_0111' : 'water',
		'water_0101' : 'water',
		'water_1000' : 'water',
		'water_0100' : 'water',
		'water_0010' : 'water',
		'water_0001' : 'water',
		'sand_1111' : 'sand',
		'sand_1001' : 'sand',
		'sand_1100' : 'sand',
		'sand_0011' : 'sand',
		'sand_0110' : 'sand',
		'sand_1010' : 'sand',
		'sand_1101' : 'sand',
		'sand_1110' : 'sand',
		'sand_1011' : 'sand',
		'sand_0111' : 'sand',
		'sand_0101' : 'sand',
		'sand_1000' : 'sand',
		'sand_0100' : 'sand',
		'sand_0010' : 'sand',
		'sand_0001' : 'sand',
	};

	var walkable = {
		'grass'             : true,
		'flowers'           : true,
		'thick_grass'       : true,
		'thicker_grass'     : true,
		'forest'            : true,
		'swamp'             : true,
		'castle_grass'      : true,
		'town_grass'        : true,
		'castle_sand'       : true,
		'town_sand'         : true,
		'bridge_up_down'    : true,
		'bridge_left_right' : true,
		'water_0000'        : false,
		'sand_0000'         : true,
		'cave_grass'        : true,
		'hill_grass'        : true,
		'mountain_grass'    : false,
		'hill_sand'         : true,
		'mountain_sand'     : false,
		'cave_sand'         : true,
		'water_1111'        : false,
		'water_1001'        : false,
		'water_1100'        : false,
		'water_0011'        : false,
		'water_0110'        : false,
		'water_1010'        : false,
		'water_1101'        : false,
		'water_1110'        : false,
		'water_1011'        : false,
		'water_0111'        : false,
		'water_0101'        : false,
		'water_1000'        : false,
		'water_0100'        : false,
		'water_0010'        : false,
		'water_0001'        : false,
		'sand_1111'         : true,
		'sand_1001'         : true,
		'sand_1100'         : true,
		'sand_0011'         : true,
		'sand_0110'         : true,
		'sand_1010'         : true,
		'sand_1101'         : true,
		'sand_1110'         : true,
		'sand_1011'         : true,
		'sand_0111'         : true,
		'sand_0101'         : true,
		'sand_1000'         : true,
		'sand_0100'         : true,
		'sand_0010'         : true,
		'sand_0001'         : true,
	};

	var height_map = get_height_map();

	heightmap_render(height_map);

	var visible_map = get_visible_map(height_map);

	do_transition_graphics();

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

	function do_transition_graphics() {

	    for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {

				var pos = c + (r * COLS);

	            var tile = get_tile(visible_map, c, r);
	            var new_tile = tile;

            	var directions = [
            		tile_type[tile_by_num[visible_map[get_neighbor(pos, 'up')]]],
            		tile_type[tile_by_num[visible_map[get_neighbor(pos, 'right')]]],
            		tile_type[tile_by_num[visible_map[get_neighbor(pos, 'down')]]],
            		tile_type[tile_by_num[visible_map[get_neighbor(pos, 'left')]]]
            	];

	            if(tile_by_num[tile] == 'sand_0000') {

	            	var substr = '';

	            	for(var i = 0; i < directions.length; i++) {

	            		if(directions[i] == 'sand' || directions[i] == 'water') {
	            			substr = substr + '0';
		            	} else {
		            		substr = substr + '1';
		            	}
	            	}

	            	new_tile = tiles['sand_'+substr];
	            } 
	            else if(tile_by_num[tile] == 'water_0000') {

	            	var substr = '';

	            	for(var i = 0; i < directions.length; i++) {

	            		if(directions[i] == 'water') {
	            			substr = substr + '0';
		            	} else {
		            		substr = substr + '1';
		            	}
	            	}

	            	new_tile = tiles['water_'+substr];
	            }

	            visible_map[pos] = new_tile;
	        }
	    }
	}

	function heightmap_render(arr, num) {

		if(typeof num === 'undefined') {
			num = 1;
		}

		// Draw heightmap onto smaller canvas

		var hm_ctx = document.getElementById('osrpgmg_heightmap_'+num).getContext('2d');
		
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

	function get_visible_map(height_map) {

		var map = [];

		// First determine water, grass, hill and mountain based on heightmap

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

		// Determine forest & desert with perlin noise
		// Low parts are forest, high are desert
		// Only apply forest to grass
		// Desert can apply to grass, hills and mountain

		var perlin_map = get_perlin_noise(80);

		// combine perlin noise with a finer perlin noise, for more details

		var perlin_map_2 = get_perlin_noise(20);

		var perlin_combine_map = [];

		for(i = 0; i < perlin_map.length; i++) {

			first_val = perlin_map[i];
			second_val = perlin_map_2[i];

			var diff = second_val - first_val;

			var adjust = diff / 4;

			var new_val = first_val + adjust;

			perlin_combine_map.push(new_val);
		}

		heightmap_render(perlin_combine_map, 2);

		for(i = 0; i < height_map.length; i++) {

			
			if(perlin_combine_map[i] > 60) {

				if(map[i] == tiles['grass']) {
					map[i] = tiles['forest'];
				}
			} else if(perlin_combine_map[i] > 50) {

				if(map[i] == tiles['grass']) {

					if(Math.random() > 0.25) {
						map[i] = tiles['thicker_grass'];
					} else if(Math.random() > 0.25) {
						map[i] = tiles['thick_grass'];
					} else if(Math.random() > 0.25) {
						map[i] = tiles['flowers'];
					}
				}

			} else if(perlin_combine_map[i] > 40) {

				if(map[i] == tiles['grass']) {

					if(Math.random() > 0.5) {
						map[i] = tiles['thick_grass'];
					} else if(Math.random() > 0.5) {
						map[i] = tiles['flowers'];
					}
				}

			} else if(perlin_combine_map[i] > 30) {

				if(map[i] == tiles['grass'] && Math.random() > 0.95) {
					map[i] = tiles['flowers'];
				}

			} else if(perlin_combine_map[i] < 30) {

				if(map[i] == tiles['grass']) {
					map[i] = tiles['sand_0000'];
				} else if(map[i] == tiles['hill_grass']) {
					map[i] = tiles['hill_sand'];
				} else if(map[i] == tiles['mountain_grass']) {
					map[i] = tiles['mountain_sand'];
				}
			}
		}

		// Add wetlands / swamp

		var perlin_map_3 = get_perlin_noise(20);

		for(i = 0; i < height_map.length; i++) {

			if(perlin_map_3[i] > 80 && tile_type[tile_by_num[map[i]]] == 'grass') {
				map[i] = tiles['swamp'];
			}
		}

		// Generate coastline dunes

		for(i = 0; i < map.length; i++) {

			if(tile_type[tile_by_num[map[i]]] == 'grass') {

				var next_to_water = false;

				var up = get_neighbor(i, 'up');

				if( tile_type[tile_by_num[map[up]]] == 'water' ) {
					next_to_water = true;
				} else {
					var down = get_neighbor(i, 'down');

					if( tile_type[tile_by_num[map[down]]] == 'water' ) {
						next_to_water = true;
					} else {
						var left = get_neighbor(i, 'left');

						if( tile_type[tile_by_num[map[left]]] == 'water' ) {
							next_to_water = true;
						} else {
							var right = get_neighbor(i, 'right');

							if( tile_type[tile_by_num[map[right]]] == 'water' ) {
								next_to_water = true;
							}
						}
					}
				}

				if(next_to_water && Math.random() < 0.75) {
					map[i] = tiles['sand_0000'];
				}
			}
		}

		// Generate river starting points

		var valid_river_starts = [];

		for(i = 0; i < height_map.length; i++) {

			var value = height_map[i];

			if(value > CUTOFF_TERRAIN - 10) {
				valid_river_starts.push(i);
			}
		}

		var fraction_river_valid = valid_river_starts.length / map.length;

		var river_start_num = Math.ceil(fraction_river_valid * 100);

		var river_starts = [];

		var close_count = 0;

		for(i = 0; i < river_start_num; i++) {

			if(close_count > 50) {
				break;
			}

			var river_start = valid_river_starts[Math.floor(Math.random() * valid_river_starts.length)];

			// Attempt to control distance between river starts

			/*if(river_starts.length) {

				var new_x = river_start % COLS;
	            var new_y = Math.floor(river_start / ROWS);

				for(j = 0; j < river_starts.length; j++) {

					var old_x = river_starts[j] % COLS;
	            	var old_y = Math.floor(river_starts[j] / ROWS);
					var dist = get_dist(new_x, new_x, old_x, old_y);

					if(dist < RIVER_START_MIN_DIST) {
						i--;
						close_count++;
						break;
					}
				}
				river_starts.push(river_start);
			} else {
				river_starts.push(river_start);
			}*/

			river_starts.push(river_start);
		}

		// Draw each river

		// binary map of river placement

		var last_dir_opposite = '';

		var river_map_all = []; // For seeing all river paths in one map, for testing
		for(i = 0; i < height_map.length; i++) {
			river_map_all.push(0);
		}

		for(i = 0; i < river_starts.length; i++) {

			var river_map = [];

			for(j = 0; j < height_map.length; j++) {
				river_map.push(0);
			}

			var draw_spot = river_starts[i];
			river_map[draw_spot] = 99;

			// Skip this river start if already under water
			if(tile_type[tile_by_num[map[draw_spot]]] == 'water') {
				continue;
			}

			// Determine flow direction by finding water distance for each direction
			// Then random chance go to closest or random direction

			var flowing = true;

			var flow_count = 0;

			var flow_dir = 'up';

			var flow_options = ['up','down','left','right'];

			while(flowing) {

				var water_dist = {
					'up'    : dist_to_water(height_map, draw_spot, 'up'),
					'down'  : dist_to_water(height_map, draw_spot, 'down'),
					'left'  : dist_to_water(height_map, draw_spot, 'left'),
					'right' : dist_to_water(height_map, draw_spot, 'right')
				};

				var flow_data = {
					'up' : get_neighbor(draw_spot, 'up'),
					'down' : get_neighbor(draw_spot, 'down'),
					'left' : get_neighbor(draw_spot, 'left'),
					'right' : get_neighbor(draw_spot, 'right')
				};

				flow_dir = 'up';

				if(water_dist['down'] < water_dist[flow_dir]) {
					flow_dir = 'down';
				}
				if(water_dist['left'] < water_dist[flow_dir]) {
					flow_dir = 'left';
				}
				if(water_dist['right'] < water_dist[flow_dir]) {
					flow_dir = 'right';
				}

				if(river_map[flow_data[flow_dir]] == 99 || Math.random() < 0.5) {

					flow_dir = flow_options[Math.floor(Math.random() * flow_options.length)];
				}

				var new_draw_spot = flow_data[flow_dir];

				// If over water, or prev spot, draw and stop
				if(tile_type[tile_by_num[map[new_draw_spot]]] == 'water' ||
					flow_count > 2500) {

					for(j = 0; j < river_map.length; j++) {

						if(river_map[j] == 99) {
							map[j] = tiles['water_0000'];
						}
					}

					flowing = false;
					flow_count = 0;
				}

				if(river_map[new_draw_spot] == 0){
					
					river_map[new_draw_spot] = 99;
					river_map_all[new_draw_spot] = 99;
					draw_spot = new_draw_spot;
				}

				flow_count++;
			}
		}

		heightmap_render(river_map_all, 3);

		// Bridges

		var valid_bridge_positions = [];

		for(var i = 0; i < river_map_all.length; i++) {

			if(river_map_all[i] == 99) {

				var directions = {
					'up' : get_neighbor(i, 'up'),
					'down' : get_neighbor(i, 'down'),
					'left' : get_neighbor(i, 'left'),
					'right' : get_neighbor(i, 'right')
				};

				if( ( river_map_all[directions['up']] == 0 && walkable[tile_by_num[map[directions['up']]]]  && river_map_all[directions['down']] == 0 && walkable[tile_by_num[map[directions['down']]]] ) ||
					( river_map_all[directions['left']] == 0 && walkable[tile_by_num[map[directions['left']]]]  && river_map_all[directions['right']] == 0 && walkable[tile_by_num[map[directions['right']]]] )
				) {
					valid_bridge_positions.push(i);
				}
			}
		}

		for(var i = 0; i < river_start_num; i++) {

			var rand_pos = valid_bridge_positions[Math.floor(Math.random() * valid_bridge_positions.length)];

			// Make sure now bridges adjacent
			var dir = {
				'up'    : get_neighbor(rand_pos, 'up'),
				'down'  : get_neighbor(rand_pos, 'down'),
				'left'  : get_neighbor(rand_pos, 'left'),
				'right' : get_neighbor(rand_pos, 'right')
			};

			if(map[dir['up']] == tiles['bridge_up_down'] || map[dir['up']] == tiles['bridge_left_right'] ||
				map[dir['down']] == tiles['bridge_up_down'] || map[dir['down']] == tiles['bridge_left_right'] ||
				map[dir['left']] == tiles['bridge_up_down'] || map[dir['left']] == tiles['bridge_left_right'] ||
				map[dir['right']] == tiles['bridge_up_down'] || map[dir['right']] == tiles['bridge_left_right']
			) {
				continue;
			}

			if( river_map_all[dir['up']] == 0 ) {
				map[rand_pos] = tiles['bridge_up_down'];
			} else {
				map[rand_pos] = tiles['bridge_left_right'];
			}
		}

		// Caves

		var valid_cave_positions = [];

		for(var i = 0; i < map.length; i++) {

			var valid = false;

			if(map[i] == tiles['mountain_grass'] || map[i] == tiles['mountain_sand']) {

				var dir = {
					'up' : get_neighbor(i, 'up'),
					'down' : get_neighbor(i, 'down'),
					'left' : get_neighbor(i, 'left'),
					'right' : get_neighbor(i, 'right')
				};

				if( walkable[tile_by_num[map[dir['up']]]] || walkable[tile_by_num[map[dir['down']]]] || walkable[tile_by_num[map[dir['left']]]] || walkable[tile_by_num[map[dir['right']]]] ) {
					valid = true;
				}

				if( valid_cave_positions.indexOf(dir['up']) !== -1 || valid_cave_positions.indexOf(dir['down']) !== -1 || valid_cave_positions.indexOf(dir['left']) !== -1 || valid_cave_positions.indexOf(dir['right']) !== -1 ) {
					continue;
				}
			}

			if(map[i] == tiles['hill_grass'] || map[i] == tiles['hill_sand']) {

				if(Math.random() < 0.1) {
					valid = true;
				}
			}

			if(valid) {
				valid_cave_positions.push(i);
			}
		}

		var cave_num = Math.ceil(valid_cave_positions.length / 30);

		for(var i = 0; i < cave_num; i++) {

			var rand_pos = valid_cave_positions[Math.floor(Math.random() * valid_cave_positions.length)];

			if( tile_type[tile_by_num[map[rand_pos]]] == 'sand' ) {
				map[rand_pos] = tiles['cave_sand'];
			} else {
				map[rand_pos] = tiles['cave_grass'];
			}
		}

		// Towns / Castles

		var valid_town_positions = [];
		var valid_town_positions_water = [];

		for(var i = 0; i < map.length; i++) {

			var valid = false;

			var dir = {
				'up' : get_neighbor(i, 'up'),
				'down' : get_neighbor(i, 'down'),
				'left' : get_neighbor(i, 'left'),
				'right' : get_neighbor(i, 'right')
			};

			if(tile_type[tile_by_num[map[i]]] == 'grass' || tile_type[tile_by_num[map[i]]] == 'sand') {

				if( walkable[tile_by_num[map[dir['up']]]] || walkable[tile_by_num[map[dir['down']]]] || walkable[tile_by_num[map[dir['left']]]] || walkable[tile_by_num[map[dir['right']]]] ) {
					valid = true;
				}
			}

			if(valid) {

				if( tile_type[tile_by_num[map[dir['up']]]] == 'water' || tile_type[tile_by_num[map[dir['down']]]] == 'water' || tile_type[tile_by_num[map[dir['left']]]] == 'water' || tile_type[tile_by_num[map[dir['right']]]] == 'water' ) {
					valid_town_positions_water.push(i);
				} else {
					valid_town_positions.push(i);
				}
			}
		}

		var walkable_tiles = 0;

		for(var i = 0; i < map.length; i++) {

			if(walkable[tile_by_num[map[i]]]) {
				walkable_tiles++;
			}
		}

		var town_num = Math.ceil(walkable_tiles / 300);

		var town_num_water = Math.min(valid_town_positions_water.length, Math.ceil(town_num / 2));
		var town_num_dry = town_num - town_num_water;

		for(var i = 0; i < town_num_water; i++) {

			var rand_pos = valid_town_positions_water[Math.floor(Math.random() * valid_town_positions_water.length)];

			var town_or_castle = 'town';

			if(Math.random() < 0.10) {
				town_or_castle = 'castle';
			}

			var dir = {
				'up' : get_neighbor(rand_pos, 'up'),
				'down' : get_neighbor(rand_pos, 'down'),
				'left' : get_neighbor(rand_pos, 'left'),
				'right' : get_neighbor(rand_pos, 'right')
			};

			if( tile_by_num[map[dir['up']]] == 'town_grass' || tile_by_num[map[dir['up']]] == 'castle_grass' || tile_by_num[map[dir['up']]] == 'town_sand' || tile_by_num[map[dir['up']]] == 'castle_sand' || 
				tile_by_num[map[dir['down']]] == 'town_grass' || tile_by_num[map[dir['down']]] == 'castle_grass' || tile_by_num[map[dir['down']]] == 'town_sand' || tile_by_num[map[dir['down']]] == 'castle_sand' ||
				tile_by_num[map[dir['left']]] == 'town_grass' || tile_by_num[map[dir['left']]] == 'castle_grass' || tile_by_num[map[dir['left']]] == 'town_sand' || tile_by_num[map[dir['left']]] == 'castle_sand' ||
				tile_by_num[map[dir['right']]] == 'town_grass' || tile_by_num[map[dir['right']]] == 'castle_grass' || tile_by_num[map[dir['right']]] == 'town_sand' || tile_by_num[map[dir['right']]] == 'castle_sand' ) {
				continue;
			}

			if( tile_type[tile_by_num[map[rand_pos]]] == 'sand' ) {
				map[rand_pos] = tiles[town_or_castle+'_sand'];
			} else {
				map[rand_pos] = tiles[town_or_castle+'_grass'];
			}
		}

		for(var i = 0; i < town_num_dry; i++) {

			var rand_pos = valid_town_positions[Math.floor(Math.random() * valid_town_positions.length)];

			var town_or_castle = 'town';

			if(Math.random() < 0.15) {
				town_or_castle = 'castle';
			}

			var dir = {
				'up' : get_neighbor(rand_pos, 'up'),
				'down' : get_neighbor(rand_pos, 'down'),
				'left' : get_neighbor(rand_pos, 'left'),
				'right' : get_neighbor(rand_pos, 'right')
			};

			if( tile_by_num[map[dir['up']]] == 'town_grass' || tile_by_num[map[dir['up']]] == 'castle_grass' || tile_by_num[map[dir['up']]] == 'town_sand' || tile_by_num[map[dir['up']]] == 'castle_sand' || 
				tile_by_num[map[dir['down']]] == 'town_grass' || tile_by_num[map[dir['down']]] == 'castle_grass' || tile_by_num[map[dir['down']]] == 'town_sand' || tile_by_num[map[dir['down']]] == 'castle_sand' ||
				tile_by_num[map[dir['left']]] == 'town_grass' || tile_by_num[map[dir['left']]] == 'castle_grass' || tile_by_num[map[dir['left']]] == 'town_sand' || tile_by_num[map[dir['left']]] == 'castle_sand' ||
				tile_by_num[map[dir['right']]] == 'town_grass' || tile_by_num[map[dir['right']]] == 'castle_grass' || tile_by_num[map[dir['right']]] == 'town_sand' || tile_by_num[map[dir['right']]] == 'castle_sand' ) {
				continue;
			}

			if( tile_type[tile_by_num[map[rand_pos]]] == 'sand' ) {
				map[rand_pos] = tiles[town_or_castle+'_sand'];
			} else {
				map[rand_pos] = tiles[town_or_castle+'_grass'];
			}
		}

		return map;
	}

	// Perlin noise
	function get_perlin_noise(adjust) {

		noise.seed(Math.random());

		var arr = [];

	    for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {
				// All noise functions return values in the range of -1 to 1.

				// noise.simplex2 and noise.perlin2 for 2d noise
				var value = noise.simplex2(c / adjust, r / adjust);

				arr.push(Math.round(((value + 1) / 2) * 99));
			}
		}

		return arr;
	}

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

	    // Now combine with a perlin noise heightmap

	    var perlin_map = get_perlin_noise(40);

		var arr_2 = [];

	    for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {

				first_val = arr[ (r * COLS) + c];
				second_val = perlin_map[ (r * COLS) + c];

				var new_val = arr[ (r * COLS) + c];

				var diff = second_val - first_val;

				var adjust = diff / 4;

				new_val = first_val + adjust;

				arr_2.push(new_val);
			}
		}

		// Now make edges ocean, with gradual transition

		var center_x = (COLS / 2) - 1;
		var center_y = (ROWS / 2) - 1;

		var land_radius = 40;

		for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {

				var dist = get_dist(center_x, center_y, c, r);

				if(dist > land_radius) {

					var further = dist - land_radius;

					var old_val = arr_2[ (r * COLS) + c];
					var new_val = old_val * ((40 - (further)) / 40);
					if(new_val < 0 || r == 0 || c == 0 || r == ROWS - 1 || c == COLS - 1) {
						new_val = 0;
					}

					arr_2[ (r * COLS) + c] = new_val;
				}
			}
		}

		arr_2 = reset_min_max(arr_2);

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

		var arr_3 = [];

		for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {

				first_val = arr_2[ (r * COLS) + c];
				second_val = arr_adjust[ (r * COLS) + c];

				var new_val = arr_2[ (r * COLS) + c];

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

				arr_3.push(new_val);
			}
		}

		//arr_3 = reset_min_max(arr_3);

	    return arr_3;
	}

	function get_dist(x1, y1, x2, y2) {

		var a = x1 - x2;
		var b = y1 - y2;

		return Math.sqrt( a*a + b*b );
	}

	function dist_to_water(height_map, pos, dir) {

		var dist = 0;
		var max_dist = ROWS;
		var water_found = false;
		var this_pos = pos;

		while(!water_found) {

			this_pos = get_neighbor(this_pos, dir);
			dist++;

			if( height_map[this_pos] < CUTOFF_WATER ) {

				water_found = true;
			}

			if(dist >= max_dist) {
				water_found = true;
			}
		}

		return dist;
	}

	function get_neighbor(pos, dir) {

		var new_pos = 0;
		var total = ROWS * COLS;

		if(dir == 'up') {
			new_pos = pos - COLS; // minus one row
			if(new_pos < 0) {
				new_pos += total;
			}
		} else if(dir == 'down') {
			new_pos = pos + COLS; // add one row
			if(new_pos >= total) {
				new_pos -= total;
			}
		} else if(dir == 'left') {
			new_pos = pos - 1;
			if(Math.floor(new_pos / COLS) != Math.floor(pos / COLS)) {
				new_pos += COLS; // add one row
			}
		} else if(dir == 'right') {
			new_pos = pos + 1;
			if(Math.floor(new_pos / COLS) != Math.floor(pos / COLS)) {
				new_pos -= COLS; // minus one row
			}
		}
		return new_pos;
	}

	function get_tile(map, col, row) {
		return map[ (row * COLS) + col];
	}
}

