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
                <router-link to="/" class="navbar-item is-size-3">
                    <img class="nav-logo" src="/img/logo.png"> Create.World
                </router-link>

                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" class="navbar-menu">
                <div class="navbar-start">
                    <router-link to="/old_school" class="navbar-item">
                        Old School RPG Map Generator
                    </router-link>
                </div>
            </div>
        </nav>
        <section class="section"><router-view></router-view></section>
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                <strong>Create.World</strong> by <a href="http://www.rowlandrose.com">Rowland Rose</a> &mdash; &copy;2019
                </p>
            </div>
        </footer>
    </div>
    `
});
