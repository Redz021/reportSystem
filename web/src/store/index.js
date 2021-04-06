import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '' || localStorage.getItem('token'),
        user: '' || JSON.parse(localStorage.getItem('user')),
        userType: '' || localStorage.getItem('userType'),
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
            state.token = ''
            state.user = {}
            state.userType = ''
        },
    },
    actions: {
        login(context, data) {
            context.commit('LOGIN', data)
        },
        logout(context) {
            context.commit('LOGOUT')
        },
    },
    getters: {},
    modules: {},
})