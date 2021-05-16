import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'element-ui/lib/theme-chalk/index.css'

axios.defaults.baseURL = 'http://localhost:3000'
    // axios.defaults.baseURL = 'http://192.168.26.18:3000'
axios.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        config.headers.Authorization = store.state.token
        return config
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error)
    }
)

Vue.use(ElementUI)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')