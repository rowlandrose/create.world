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

        <div class="overflow_scroll">
            <canvas id="osrpgmg" width="2560" height="1920"></canvas>
        </div>

        <p>Credit to Lanea Zimmerman for <a href="https://opengameart.org/content/tiny-16-basic">tile graphics</a></p>

    </div>

    `,
    mounted : function() {

        loadScript('/js/osrpgmg.js', function() {
            osrpgmg_init();
        });
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
