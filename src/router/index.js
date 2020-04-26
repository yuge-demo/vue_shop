import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './../components/Login.vue'
import Home from './../components/Home.vue'
import Welcome from "./../components/Welcome.vue"
import Users from "./../components/user/Users.vue"
import Rights from "./../components/power/Rights.vue"
import Roles from "./../components/power/Roles.vue"
import Cate from "./../components/goods/Cate.vue"


Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home, redirect: '/welcome', children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate }
      ]
    }
  ]
})

//挂载路由导航首位
router.beforeEach((to, from, next) => {
  //( to , from , next)
  //to将要访问的路径
  //from 代表从那个路径转换而来
  //next 是一个函数 , 表示放行   next() 放行    next('/login')强制跳转到
  if (to.path === '/login') return next();
  //获取token
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login');
  next();
})
export default router
