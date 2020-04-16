import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/vi/'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  //为请求头对象，添加Token验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //标准格式
  return config;
})

// Vue.prototype.$http = axios    全局注册，使用方法为:this.$http
Vue.config.productionTip = false

Vue.use(VueAxios, axios)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')