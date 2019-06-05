import Vue from 'vue'
import Router from 'vue-router'
// Element组件
import Element from "../components/element.vue"
// 引入login登入页面
import Login from "../components/login/login.vue"
// 引入home
import Home from "../components/home/home.vue"
import Users from "../components/users/users.vue"
import Roles from "../components/roles/roles.vue"
import Rights from "../components/rights/rights.vue"
import { Message } from 'element-ui';
import Categories from "../components/categories/categories.vue"

Vue.use(Router)
// 暴露出去
var router= new Router({
  routes: [
    { path: "/", redirect: { name: "home" } },
    { path: "/element", component: Element },  // 使用element-ui 路由
    { path: "/login", name: "login", component: Login },  // 获取登入页面'
    {
      path: "/home", name: "home", component: Home,
      children: [
        { path: "/users", name: "users", component: Users },
        {path:"/roles",name:"roles",component:Roles},
        {path:"/rights",name:"rights",component:Rights},
        {path:"/categories",name:"categories",component:Categories}
      ]
    }

  ]
})
// 添加一个路由守卫
router.beforeEach((to, from, next) => {
  // 完成登录逻辑
  // 只要请求的路由不是 login 就需要进行登录验证
  if (to.path != '/login') {
    // 判断是否存在  token
    if (!window.localStorage.getItem('token')) {
      // console.log(window.localStorage.getItem('token'))
      Message({
        type: 'error',
        message: '您还没有登录'
      })
      router.push('/login')
      return
    } 
  }
  next()
})
// 暴露
export default router