import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        // redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/student',
        name: 'Student',
        component: (resolve) =>
            require(['../views/student/StudentHome.vue'], resolve),
        meta: {
            requireAuth: true,
        },
    },
    {
        path: '/teacher',
        name: 'Teacher',
        redirect: '/teacher/course',
        component: (resolve) =>
            require(['../views/teacher/TeacherHome.vue'], resolve),
        children: [{
                path: 'course',
                name: 'TeacherCourse',
                component: (resolve) =>
                    require(['../views/teacher/TeacherCourse.vue'], resolve),
            },
            {
                path: 'course/:id',
                name: 'SingleCourse',
                component: (resolve) =>
                    require(['../views/teacher/SingleCourse.vue'], resolve),
            },
            {
                path: 'teacherManage',
                name: 'TeacherManage',
                component: (resolve) =>
                    require(['../views/teacher/TeacherManage.vue'], resolve),
            },
            {
                path: 'studentManage',
                name: 'StudentManage',
                component: (resolve) =>
                    require(['../views/teacher/StudentManage.vue'], resolve),
            },
            {
                path: 'courseManage',
                name: 'CourseManage',
                component: (resolve) =>
                    require(['../views/teacher/CourseManage.vue'], resolve),
            },
            {
                path: 'memberManage',
                name: 'MemberManage',
                component: (resolve) =>
                    require(['../views/teacher/MemberManage.vue'], resolve),
            },
        ],
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
    if (to.path == '/') {
        if (store.state.userType == 'student') {
            router.replace('/student') //重定向
        } else if (store.state.userType == 'teacher') {
            router.replace('/teacher') //重定向教师
        } else {
            router.replace('/login') //重定向登录
        }
    }
    if (to.meta.requireAuth) {
        if (store.state.token) {
            next()
        } else {
            router.push('login')
        }
    } else {
        next()
    }
    // console.log(to, from, next)
})

export default router