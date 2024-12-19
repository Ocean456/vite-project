import {createRouter, createWebHashHistory} from 'vue-router'

const index = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'

        },
        {
            path: '/about',
            component: () => import('../views/base/About.vue')
        },
        {
            path: '/login',
            component: () => import('../views/base/Login.vue')
        },
        {
            path: '/register',
            component: () => import('../views/base/Register.vue')
        },
        {
            path: '/main',
            component: () => import('../views/Main.vue')
        },
        {
            path: '/info',
            component: () => import('../components/personal/Information.vue')
        },
        {
            path: '/statistics',
            component: () => import('../views/main/Statistics.vue')
        }
    ]
})

export default index
