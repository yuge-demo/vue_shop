import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from './../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './../components/Login.vue')
// import Home from './../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './../components/Home.vue')
// import Welcome from "./../components/Welcome.vue"
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './../components/Welcome.vue')

// import Users from "./../components/user/Users.vue"
const Users = () => import(/* webpackChunkName: "users_right_roles" */ './../components/user/Users.vue')
// import Rights from "./../components/power/Rights.vue"
const Rights = () => import(/* webpackChunkName: "users_right_roles" */ './../components/power/Rights.vue')
// import Roles from "./../components/power/Roles.vue"
const Roles = () => import(/* webpackChunkName: "users_right_roles" */ './../components/power/Roles.vue')

// import Cate from "./../components/goods/Cate.vue"
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ './../components/goods/Cate.vue')
// import Params from "./../components/goods/Params.vue"
const Params = () => import(/* webpackChunkName: "Cate_Params" */ './../components/goods/Params.vue')

// import List from "./../components/goods/List.vue"
const List = () => import(/* webpackChunkName: "List_Add" */ './../components/goods/List.vue')
// import Add from "./../components/goods/Add.vue"
const Add = () => import(/* webpackChunkName: "List_Add" */ './../components/goods/Add.vue')

// import Order from "./../components/order/Order.vue"
const Order = () => import(/* webpackChunkName: "Order_Report" */ './../components/order/Order.vue')
// import Report from "./../components/report/Report.vue"
const Report = () => import(/* webpackChunkName: "Order_Report" */ './../components/report/Report.vue')

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
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report },
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
