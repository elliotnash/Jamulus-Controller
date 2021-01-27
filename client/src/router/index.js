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
      //fetch credentials from cookie to see if can resume session
      store.commit("fetchCredentials")

      store.dispatch('authenticate', store.state.credentials).then(() => {
        console.log('auth success')
        next()
      }, () => {
        console.log('auth fail')
        next('/login')
      })
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