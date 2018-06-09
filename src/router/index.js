import Vue from 'vue'
import Router from 'vue-router'

import Signup from '../components/Signup'
import Main from '../components/Main'
import Login from '../components/Login'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
  ]
})

