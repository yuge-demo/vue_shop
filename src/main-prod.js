import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import TreeTable from 'vue-table-with-tree-grid'
//
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/vi/'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 在request中展示进度条  在response中关闭进度条 
axios.interceptors.request.use(config => {
      //为请求头对象，添加Token验证的 Authorization 字段
      NProgress.start();
      config.headers.Authorization = window.sessionStorage.getItem('token')
      //标准格式
      return config;
})
axios.interceptors.response.use(config => {
      NProgress.done();
      return config
})

// Vue.prototype.$http = axios    全局注册，使用方法为:this.$http
Vue.config.productionTip = false
//组件名称    导入组件
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)


//全局过滤器  函数是哦dateFormat     通过originVal输入时间函数
Vue.filter('dateFormat', function (originVal) {
      const dt = new Date(originVal)
      // padStart用于头部补全  padEnd用于尾部补全    
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, "0")
      const d = (dt.getDate() + '').padStart(2, "0")

      const hh = (dt.getHours() + '').padStart(2, "0")
      const mm = (dt.getMinutes() + '').padStart(2, "0")
      const ss = (dt.getSeconds() + '').padStart(2, "0")

      // return `yyyy-mm-dd hh:mm:ss`
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.use(VueAxios, axios)
new Vue({
      router,
      render: h => h(App)
}).$mount('#app')
