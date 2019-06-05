// 封装一个axios插件
// 导入Vue
import Vue from "vue"
// 导入axios
import axios from "axios"
var myaxios={};
// 添加衣蛾install方法
myaxios.install = function(vue){
    // 设置一个拦截器
    axios.interceptors.request.use(config => {
        if(config.url !== "login"){
            config.headers.common["Authorization"] = localStorage.getItem("token")
        }
        return config
    })
    // 统一设置请求的api
    axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"
    // 给vue实例对象添加方法
    Vue.prototype.$http = axios
}

// 将对象暴露出去
export default myaxios