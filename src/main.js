// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueLodash from 'vue-lodash'
import App from './App'
import router from './router'
import VueCookie from 'vue-cookie'
import VueAnalytics from 'vue-analytics'

// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootswatch/dist/solar/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue.js'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueLodash)
Vue.use(VueCookie)
Vue.use(VueAnalytics, {
  id: 'UA-120221336-1',
  router
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
