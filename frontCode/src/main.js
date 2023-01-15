import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import auth from "./auth/index.js" // 将封装的axios函数注册到原型链上
Vue.prototype.$auth = auth

import "./common/css/reset.css"; //引入重置样式表

import ElementUI from 'element-ui'; //引入饿了么
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import install from './directives' // 引入并使用自定义指令
Vue.use(install)

import store from './store/index' // 引入vuex

import router from "@/router/index.js" //引入路由

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
