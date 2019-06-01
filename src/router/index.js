import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// Element组件
import Element from "../components/element.vue"
// 引入login登入页面
import Login from "../components/login/login.vue"
// 引入home
import Home from "../components/home/home.vue"

// 暴露出去
export default new Router({
  routes:[
    {path:"/",redirect:{name:"home"}},
    {path:"/element",component:Element},  // 使用element-ui 路由
    {path:"/login",name:"login",component:Login},  // 获取登入页面'
    {path:"/home",name:"home",component:Home}

  ]
})