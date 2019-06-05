// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入element-ui
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
// 引入body的全局样式
import "./assets/css/index.css"
// 引入 axios 
import myaxios from './assets/js/myaxios.js'
// 调用方法 use
Vue.use(myaxios)
// 定义一个全局组件 element-tree-grid
import TreeGrid from "element-tree-grid"
// 注册
Vue.component(TreeGrid.name, TreeGrid)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
