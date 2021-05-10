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
        meta: { title: '登录' },
    },
    {
        path: '/student',
        name: 'Student',
        redirect: '/student/course',
        component: (resolve) =>
            require(['../views/student/StudentHome.vue'], resolve),
        children: [{
                path: 'course',
                name: 'StudentCourse',
                meta: {
                    requireAuth: true,
                    title: '我的课程',
                },
                component: (resolve) =>
                    require(['../views/student/StudentCourse.vue'], resolve),
            },
            {
                path: 'course/:id',
                name: 'StudentSingleCourse',
                meta: {
                    requireAuth: true,
                    title: '课程详情',
                },
                component: (resolve) =>
                    require(['../views/student/StudentSingleCourse.vue'], resolve),
            },
            {
                path: 'report/:id',
                name: 'StudentReport',
                meta: {
                    requireAuth: true,
                    title: '我的任务',
                },
                component: (resolve) =>
                    require(['../views/student/StudentReport.vue'], resolve),
            },
            {
                path: 'evaluate/:id',
                name: 'EvaluateReport',
                meta: {
                    requireAuth: true,
                    title: '评阅结果',
                },
                component: (resolve) =>
                    require(['../views/student/EvaluateReport.vue'], resolve),
            },
        ],
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
                meta: {
                    requireAuth: true,
                    title: '我的课程',
                },
                component: (resolve) =>
                    require(['../views/teacher/TeacherCourse.vue'], resolve),
            },
            {
                path: 'course/:id',
                name: 'SingleCourse',
                meta: {
                    requireAuth: true,
                    title: '课程详情',
                },
                component: (resolve) =>
                    require(['../views/teacher/SingleCourse.vue'], resolve),
            },
            {
                path: 'report/:id',
                name: 'TeacherReport',
                meta: {
                    requireAuth: true,
                    title: '查看报告',
                },
                component: (resolve) =>
                    require(['../views/teacher/TeacherReport.vue'], resolve),
            },
            {
                path: 'teacherManage',
                name: 'TeacherManage',
                meta: {
                    requireAuth: true,
                    title: '教师管理',
                },
                component: (resolve) =>
                    require(['../views/teacher/TeacherManage.vue'], resolve),
            },
            {
                path: 'studentManage',
                name: 'StudentManage',
                meta: {
                    requireAuth: true,
                    title: '学生管理',
                },
                component: (resolve) =>
                    require(['../views/teacher/StudentManage.vue'], resolve),
            },
            {
                path: 'courseManage',
                name: 'CourseManage',
                meta: {
                    requireAuth: true,
                    title: '课程管理',
                },
                component: (resolve) =>
                    require(['../views/teacher/CourseManage.vue'], resolve),
            },
            {
                path: 'memberManage',
                name: 'MemberManage',
                meta: {
                    requireAuth: true,
                    title: '课程成员管理',
                },
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
    if (to.meta.title) {
        document.title = to.meta.title
    }
    if (to.meta.requireAuth) {
        if (store.state.token) {
            let path = to.path.match(/\/(\w+)\/?/)[1]
            console.log(path)
            if (store.state.userType == path) {
                next()
            } else {
                router.replace(`/${store.state.userType}`)
            }
        } else {
            router.push('login')
        }
    } else {
        next()
    }
})

export default router