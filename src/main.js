// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import vuetify from './plugins/vuetify'
import * as echarts from 'echarts';
import Plugin from 'v-fit-columns';
import "@/assets/css/global.css"
import urlJoin from "url-join"
import Vuetify from 'vuetify'
Vue.use(Vuetify)
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;
import './assets/iconfont/iconfont.js'
axios.defaults.baseURL = 'http://k3s-sat.act.buaa.edu.cn/api'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
Vue.prototype.$http = axios

Vue.use(ElementUI);
Vue.use(Plugin);

/* eslint-disable no-new */

new Vue({
  vuetify,
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})

//监听sessionstorage变化
Vue.prototype.resetSetItem = function (key, newVal) {
  //注意categoryNum为要监听的属性，实际开发中请自行修改
    if (key === 'name') {
        // 创建一个StorageEvent事件
        var newStorageEvent = document.createEvent('StorageEvent');
        const storage = {
            setItem: function (k, val) {
                sessionStorage.setItem(k, val);
                // 初始化创建的事件
                newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
                // 派发对象
                window.dispatchEvent(newStorageEvent)
                console.log('派发')
            }
        }
        return storage.setItem(key, newVal);
    }
  }
