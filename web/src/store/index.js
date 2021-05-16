import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '' || localStorage.getItem('token') || sessionStorage.getItem('token'),
        user: '' ||
            JSON.parse(localStorage.getItem('user')) ||
            JSON.parse(sessionStorage.getItem('user')),
        userType: '' ||
            localStorage.getItem('userType') ||
            sessionStorage.getItem('userType'),
    },
    mutations: {
        LOGIN(state, { token, user, userType }) {
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('userType', userType)
            state.token = token
            state.user = user
            state.userType = userType
        },
        LOGOUT(state) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('userType')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('userType')
            state.token = ''
            state.user = {}
            state.userType = ''
        },
        LOGINTEMP(state, { token, user, userType }) {
            sessionStorage.setItem('token', token)
            sessionStorage.setItem('user', JSON.stringify(user))
            sessionStorage.setItem('userType', userType)
            state.token = token
            state.user = user
            state.userType = userType
        },
        UPDATEUSER(state, newUser) {
            localStorage.setItem('user', JSON.stringify(newUser))
            state.user = newUser
        },
    },
    actions: {
        login(context, data) {
            if (data.rememberMe) context.commit('LOGIN', data)
            else context.commit('LOGINTEMP', data)
        },
        logout(context) {
            context.commit('LOGOUT')
        },
    },
    getters: {},
    modules: {},
})