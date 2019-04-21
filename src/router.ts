import Vue from 'vue'
import Router from 'vue-router'
import FormComponentDemo from './components/Demo/FormComponent.demo.vue'
import { createRoute } from 'vue-book'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: FormComponentDemo
    },
    createRoute({
      requireContext: require.context('./components', true, /.demo.vue$/),
      path: '/demo',
      hideFileExtensions: true, // optional, hides file extensions in list.
    })
  ]
})
