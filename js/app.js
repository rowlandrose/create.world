new Vue({
    router,
    el: '#app',
    store: new Vuex.Store({
        state: {
            count: 3
        },
        mutations: {
            increment (state) {
                state.count++
            }
        }
    }),
    methods: {
        'buttonClick': function() {
            this.$store.commit('increment')
        }
    },
    data: {
        test_msg: 'hello world!'
    },
    template: `
    <div>
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <router-link to="/" class="navbar-item">
                    <img class="nav-logo" src="/img/logo.png"> Team Tickets
                </router-link>

                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" class="navbar-menu">
                <div class="navbar-start">
                    <router-link to="/register" class="navbar-item">
                        Register
                    </router-link>

                    <router-link to="/tickets" class="navbar-item">
                        Tickets {{ this.$store.state.count }}
                    </router-link>

                    <a class="navbar-item" @click="buttonClick">Increment</a>

                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">
                        More
                        </a>

                        <div class="navbar-dropdown">
                        <a class="navbar-item">
                            {{ test_msg }}
                        </a>
                        <a class="navbar-item">
                            Jobs
                        </a>
                        <a class="navbar-item">
                            Contact
                        </a>
                        <hr class="navbar-divider">
                        <a class="navbar-item">
                            Report an issue
                        </a>
                        </div>
                    </div>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <router-link to="/register" class="button is-primary">
                                <strong>Register</strong>
                            </router-link>
                            <router-link to="/sign_in" class="button is-light">
                                Sign in
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <section class="section"><router-view></router-view></section>
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                <strong>Team Tickets</strong> by <a href="http://www.rowlandrose.com">Rowland Rose</a> &mdash; &copy;2018
                </p>
            </div>
        </footer>
    </div>
    `
});
