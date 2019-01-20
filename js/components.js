var Home = {
    template: `

    <div class="container">

        <h1 class="title is-1">Fantasy Map Generation Tools</h1>

        <p>Right now we have one tool available:</p>

        <router-link to="/old_school" class="button">
            Old School RPG Map Generator
        </router-link>

    </div>

    `
};

var OldSchool = {
    template: `

    <div class="container">

        <h1 class="title is-1">Old School RPG Map Generator</h1>
        <p class="title is-4">Version 1.1 &mdash; Last Updated: 1/20/2019</p>

        <p>New map generated every time the page is refreshed.</p>
        <p>"Create.World" and "Old School RPG Map Generator" are open source projects by <a href="http://www.rowlandrose.com">Rowland Rose</a> released under the <a href="https://github.com/rowlandrose/create.world/blob/master/LICENSE">Mozilla Public License 2.0</a>.</p>
        <p><a href="https://github.com/rowlandrose/create.world/blob/master/js/osrpgmg.js"><img style="vertical-align:bottom;" src="/img/github_mark.png" width="30" height="30" alt="GitHub">View Source</a></p>

        <h2 class="title is-3">Settings</h2>

        <div class="num_slider">
            <input id="tile_num_slider" class="slider has-output is-fullwidth" v-model="tile_num" min="128" max="256" step="128" type="range">
            <output for="tile_num_slider" v-html="tile_num"></output>
        </div>

        <button @click="generate_new_map" class="button is-info" id="generate_new_map">Generate New Map</button>

        <h2 class="title is-3">Behind the Scenes</h2>

        <canvas id="osrpgmg_heightmap_1" width="128" height="128"></canvas>
        <canvas id="osrpgmg_heightmap_2" width="128" height="128"></canvas>
        <canvas id="osrpgmg_heightmap_3" width="128" height="128"></canvas>

        <h2 class="title is-3">Minimap Preview</h2>

        <canvas id="osrpgmg_preview" width="256" height="256"></canvas>

        <h2 class="title is-3">Downloads</h2>

        <a @click.prevent="download_full_image" :href="download_href" class="button is-info" target="_blank" id="download_full_image">Download Full Image</a>

        <p>Will be a large .png</p>

        <!--<a @click.prevent="download_tiled" :href="download_href" class="button is-info" target="_blank" id="download_tiled">Tiled Map Editor Files</a>

        <p>Will be .zip that includes .tmx and .png. Works with <a href="https://www.mapeditor.org/">Tiled Map Editor</a>.</p>
        -->
        <h2 class="title is-3">Full Map in a Scrollable Container</h2>

        <div class="full_map_container">
            <canvas id="osrpgmg" width="2048" height="2048"></canvas>
        </div>

        <h2 class="title is-3">Credits / Attribution / References</h2>

        <p class="title is-4">Thanks to...</p>

        <p>Lanea Zimmerman for <a href="https://opengameart.org/content/tiny-16-basic">tile graphics</a>.</p>
        <p>Hunter Loftis for his <a href="https://github.com/hunterloftis/playfuljs-demos/blob/gh-pages/terrain/index.html">Javascript implementation of the diamond-square algorithm</a>, which I've used here.</p>
        <p>Seph Gentle for his <a href="https://github.com/josephg/noisejs">Javascript library for 2d & 3d perlin noise and simplex noise</a>, which I've used here.</p>
        
        <p><a href="https://blog.habrador.com/2013/02/how-to-generate-random-terrain.html">This blog post</a> by Erik Nordeus for giving a great overview of possible terrain generation methods.</p>
        <p><a href="http://nullwise.com/procedurally_generated_pirate_map.html">This blog post</a> by Maato for sharing the idea of combining two diamond-square heightmaps for more varied mountains.</p>
        <p>Gilles Leblanc for his series of blog posts on <a href="https://gillesleblanc.wordpress.com/2012/10/16/creating-a-random-2d-game-world-map/">creating a random 2d game world map</a>, which gave inspiration and got me thinking about rivers.</p>

    </div>

    `,
    data : function() {
        return {
            download_href : '',
            tile_num : 128
        }
    },
    mounted : function() {

        loadScripts([
            '/lib/playfuljs/diamond_square.js',
            '/lib/noisejs/2014-07-07/perlin.js',
            '/lib/jszip/Stuk-jszip-9fb481a/dist/jszip.min.js',
            '/js/osrpgmg.js'
        ], function() {
            osrpgmg_init();
        });
    },
    methods : {
        download_full_image : function() {
            this.download_href = document.getElementById('osrpgmg').toDataURL('image/png');
            window.open(this.download_href, '_blank');
        },
        download_tiled : function() {

            /*var zip = new JSZip();
            zip.file("Testing.txt", "Proper content will come soon\n");
            var img = zip.folder("images");
            img.file("testA.png", document.getElementById('osrpgmg').toDataURL('image/png'), {base64: true});
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                // see FileSaver.js
                saveAs(content, "Test1.zip");
            });
            this.download_href = document.getElementById('osrpgmg').toDataURL('image/png');
            window.open(this.download_href, '_blank');*/
        },
        generate_new_map : function() {
            osrpgmg_init(this.tile_num);
        }
    }
};

var Tickets = {
    template: '<div>Tickets</div>'
};

var Teams = {
    template: `
        <div class="container">

        <h1 class="title is-1">Teams</h1>

            <p v-if="failed" v-html="fail_message"></p>

            <table class="table" v-if="!loading && !failed">
                <tbody>
                    <tr v-for="team in teams">
                        <td v-html="team['name']"></td>
                    </tr>
                </tbody>
            </table>

        </div>
    `,
    data : function() {
        return {
            loading : false,
            failed : false,
            fail_message : '',
            teams : []
        }
    },
    created : function() {

        axios.post('/api/teams/', {
            token: getCookie('auth_token')
        })
        .then(function (response) {

            if(response.data.status == 'success') {
                this.teams = response.data.data.teams;
            } else {
                this.failed = true;
                this.fail_message = response.data.message;
            }

            this.loading = false;

        }.bind(this))
        .catch(function (error) {
            this.fail_message = 'Unknown error. Please notify site administrator.';
            this.failed = true;
            this.loading = false;
        }.bind(this));
    },
    methods : {

    }
};
