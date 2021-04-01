import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: {},
        type: '',
    },
    mutations: {
        auth_request(state) {
            state.status = 'loading'
        },
        auth_success(state, token, user, type) {
            state.status = 'success'
            state.token = token
            state.user = user
            state.type = type
        },
        auth_error(state) {
            state.status = 'error'
        },
        logout(state) {
            state.status = ''
            state.token = ''
            state.user = {}
            state.type = ''
        },
    },
    actions: {
        LOGIN({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios
                    .post('/login', user)
                    .then((res) => {
                        console.log(res)
                        const token = res.data.token
                        const user = res.data.user
                        const type = res.data.type
                        localStorage.setItem('token', token)
                        axios.defaults.headers.common['Authorization'] = token
                        commit('auth_success', token, user, type)
                        resolve(res)
                    })
                    .catch((err) => {
                        console.error(err)
                        commit('auth_error')
                        localStorage.removeItem('token')
                        reject(err)
                    })
            })
        },
        LOG_OUT({ commit, state }) {
            return new Promise((resolve, reject) => {
                axios
                    .get('/logout')
                    .then((res) => {
                        console.log(res)
                        commit('logout')
                        delete axios.defaults.headers.common['Authorization']
                        resolve(res)
                    })
                    .catch((err) => {
                        console.error(err)
                        reject(err)
                    })
            })
        },
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
        authStatus: (state) => state.status,
    },
    modules: {},
})