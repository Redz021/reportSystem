import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/student',
        name: 'Student',
        component: (resolve) => require(['../views/StudentHome.vue'], resolve),
        meta: {
            requireAuth: true,
        },
    },
    {
        path: '/teacher',
        name: 'Teacher',
        component: (resolve) => require(['../views/TeacherHome.vue'], resolve),
        meta: {
            requireAuth: true,
        },
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        router.push('login')
    } else {
        next()
    }
})

export default router