import Vue from 'vue'
import VueRouter from 'vue-router'
import Panel from '@/views/Panel'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Panel',
    component: Panel
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '*',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
