import RouterView from './components/view'
import RouterLink from './components/link'

export let _Vue
/**
 * 插件的作用
 * 1、注册全局属性 $router $route
 * 2、注册全局指令 v-scroll
 * 3、注册全局组件 router-view router-link
 */
export default function install(Vue) {
  _Vue = Vue

  // 使用Vue.mixin实现全局挂载vue-router
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        this._routerRoot = this
        this._router = this.$options.router

        // 初始化路由
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot
      }
    }
  })
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route
    }
  })
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router
    }
  })
  Vue.component('RouterView', RouterView)
  Vue.component('RouterLink', RouterLink)
}
