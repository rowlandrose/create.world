
function osrpgmg_init() {

	var no_cache = Math.floor(new Date().getTime() / 1000); // unix timestamp

	var ctx = document.getElementById('osrpgmg').getContext('2d');

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

	var visible_map = grass_map();

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

	function grass_map() {
		var arr = [];
		for(i = 0; i < COLS * ROWS; i++) {
			arr.push( tiles['water_0000'] );
		}
		return arr;
	}

	function get_tile(map, col, row) {
		return map[ (row * COLS) + col];
	}
}

