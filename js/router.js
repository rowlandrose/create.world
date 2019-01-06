var router = new VueRouter({
    linkActiveClass: 'is-active',
    mode: 'history',
    routes: [
        { path: '/', component: Home },
        { path: '/old_school', component: OldSchool },
    ]
});
