// Vue-Router利用了vue的响应式原理和插件机制

let _Vue

class VueRouter {
  constructor(options) {
    this.$options = options

    // this.current = window.location.hash.slice(1)

    // 借助Vue响应式数据
    const vm = new _Vue({
      data: {
        current: window.location.hash.slice(1)
      }
    })
    Object.defineProperty(this, 'current', {
      get() {
        return vm.current
      },
      set(value) {
        if(value !== this.current) {
          vm.current = value
        }
      }
    })
    // this.current = vm.current
    // defineReactive
    // _Vue.util.defineReactive(this, 'current', window.location.hash.slice(1))

    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1)
    })
  }
}

// Vue插件必须要实现install方法
VueRouter.install = function(Vue) {
  _Vue = Vue

  _Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })

  _Vue.component('router-view', {
    render(h) {
      const routes = this.$router.$options.routes
      const current = this.$router.current
      const route = routes.find((route) => route.path === current) || {}
      return h(route.component)
    }
  })
  _Vue.component('router-link', {
    props: {
      to: {
        type: String,
        default: ''
      }
    },
    render(h) {
      return h(
        'a',
        {
          attrs: {
            href: `#${this.to}`
          }
        },
        this.$slots.default
      )
    }
  })
}

export default VueRouter
