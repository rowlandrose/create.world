var router = new VueRouter({
    linkActiveClass: 'is-active',
    mode: 'history',
    routes: [
        { path: '/', component: Home },
        { path: '/tickets', component: Tickets },
        { path: '/register', component: Register },
        { path: '/email_verify', component: EmailVerify },
        { path: '/email_verify/:token', component: EmailVerify },
        { path: '/sign_in', component: SignIn },
        { path: '/teams', component: Teams },
        { path: '/edit_team', component: EditTeam },
        { path: '/edit_team/:team_id', component: EditTeam }
    ]
});
