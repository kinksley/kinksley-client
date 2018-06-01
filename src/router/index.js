import Vue from 'vue'
import Router from 'vue-router'
import Shoots from '@/components/Shoots'
import Model from '@/components/Model'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Front (-> Shoots)',
      component: Shoots
    },
    {
      path: '/shoots',
      name: 'Shoots',
      component: Shoots
    },
    {
      path: '/model',
      name: 'Model',
      component: Model
    }
  ]
})
