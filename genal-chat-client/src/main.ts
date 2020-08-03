import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// 引入ant-desigin
import './ant-desigin';

// 引入moment
import moment from 'moment';
import 'moment/locale/zh-cn';

// 使用中文时间
moment.locale('zh-cn');
Vue.prototype.$moment = moment;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
