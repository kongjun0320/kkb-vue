import Vue from 'vue'
// import VueRouter from 'vue-router'
// import VueRouter from './k-vue-router'
import VueRouter from './vue-router'

import Home from '../views/Home.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    children: [
      {
        path: 'a',
        name: 'AboutA',
        component: {
          render(_h) {
            return <h3>about-a</h3>
          }
        }
      },
      {
        path: 'b',
        name: 'AboutB',
        component: {
          render(_h) {
            return <h3>about-b</h3>
          }
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
