import Vue from 'vue'
import Router from 'vue-router'
import Shoots from '@/components/Shoots'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Shoots',
      component: Shoots
    },
    {
      path: '/shoots',
      name: 'Shoots',
      component: Shoots
    }
  ]
})
