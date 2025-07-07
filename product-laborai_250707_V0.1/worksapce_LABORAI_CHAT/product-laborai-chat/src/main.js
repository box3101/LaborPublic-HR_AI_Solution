import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false;
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard)

new Vue({
  router, //Vue 인스턴스에 연결
  render: (h) => h(App),
}).$mount('#app');

