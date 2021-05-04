let _Vue
class Store {
  constructor(options) {
    this.$options = options
    this._mutations = options.mutations
    this._actions = options.actions
    this._getters = options.getters

    this.commit = this.commit.bind(this)

    const self = this
    this.getters = {}
    // 1.普通实现
    // Object.keys(this._getters).forEach((key) => {
    //   Object.defineProperty(this.getters, key, {
    //     get() {
    //       return self._getters[key](self.state)
    //     }
    //   })
    // })
    // 2.computed
    let computed = {}
    Object.keys(this._getters).forEach((key) => {
      computed[key] = () => {
        return this._getters[key](options.state)
      }
      Object.defineProperty(this.getters, key, {
        get() {
          return self._vm[key]
        }
      })
    })

    // 1.用户可以直接修改state
    // this.state = new _Vue({
    //   data: options.state
    // })
    // 2.
    this._vm = new _Vue({
      data: {
        // $$state不会被代理到this._vm上
        $$state: options.state
      },
      computed
    })
  }
  get state() {
    return this._vm.$data.$$state
    // return this._vm._data.$$state
  }
  set(v) {
    console.error('error')
  }
  commit(type, payload) {
    this._mutations[type](this.state, payload)
  }
  dispatch(type, payload) {
    this._actions[type](this, payload)
  }
}

function install(Vue) {
  _Vue = Vue

  _Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default {
  Store,
  install
}
