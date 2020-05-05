import Vue from 'vue';
import axios from 'axios'
import { store } from './store/store';
import App from './App.vue';
import router from './router';
import Router from 'vue-router'
import vuetify from './plugins/vuetify';
import VueTour from 'vue-tour'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

// Configure vue tour
require('vue-tour/dist/vue-tour.css')
Vue.use(VueTour)

Vue.config.productionTip = false;

//Silence routing error when handling unauthorized page navigation
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

//Silence .native modifier warning from v-calendar (https://github.com/vuetifyjs/vuetify/issues/9999)
const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
// eslint-disable-next-line no-unused-vars
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null;
    vm = null;
    trace = null;
  }
}


//Find base url for API calls
const curUrl = window.location.href
var serverURL
if (curUrl.includes("localhost")) {
  serverURL = "http://localhost:8000"
} else {
  serverURL = "http://qplan.engineering.queensu.ca:8000"
}

//Configure Vue's $http for global api calls
const base = axios.create({
  baseURL: serverURL
})
Vue.prototype.$axios = base


new Vue({
  router,
  vuetify,
  store,
  created(){
    store.commit('updateServerUrls', serverURL)
    store.dispatch('checkSession')
  },
  render: h => h(App),
}).$mount('#app');
