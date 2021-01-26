import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Panel',
    component: () => import('@/views/Panel'),
    beforeEnter: (to, from, next) => {
      //authentication to prevent loading panel when not logged in
      if(store.state.authenticated === false) {
        next();
      } else {
        next();
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '*',
    name: 'About',
    component: () => import('@/views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
