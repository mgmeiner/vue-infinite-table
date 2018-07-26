import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'

import Home from './Home'

import 'skeleton-css/css/normalize.css'
import 'skeleton-css/css/skeleton.css'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: Home }
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')