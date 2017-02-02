import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';

import Home from './Home';
import Advanced from './Advanced';

import 'skeleton-css/css/normalize.css';
import 'skeleton-css/css/skeleton.css';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/advanced', component: Advanced }
  ]
});

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
});
