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
            component: () => import('../views/About.vue')
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
            path: '/chat',
            component: () => import('../views/Chat.vue')
        },
        {
            path: '/info',
            component: () => import('../components/Information.vue')
        }
    ]
})

export default index
