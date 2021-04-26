// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import store from './store/store'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VueClipboard from 'vue-clipboard2'
import echarts from 'echarts'


Vue.use(VueQuillEditor)

Vue.use(ElementUI)
Vue.use(Vuex)

Vue.use(VueClipboard)

Vue.prototype.$echarts = echarts 
Vue.prototype.$http=axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
