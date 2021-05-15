class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.$methods = options.methods

    this.proxy(options.data)
    observe(options.data)

    // 挂载
    if (options.el) {
      this.$mount(options.el)
    }
  }

  $mount(el) {
    // 宿主元素
    this.$el = document.querySelector(el)
    // 更新函数
    const updateComponent = () => {
      const vnode = this.$options.render.call(this, this.$createElement)
      this._update(vnode)
    }
    // 创建watcher
    new Watcher(this, updateComponent)
  }

  _update(vnode) {
    const preVnode = this._vnode
    if (!preVnode) {
      // 初始化
      this.__patch__(this.$el, vnode)
    } else {
      // 更新
      this.__patch__(preVnode, vnode)
    }
    this._vnode = vnode
  }

  __patch__(oldVnode, vnode) {
    console.log(oldVnode, vnode);
    // init
    if (oldVnode.nodeType) {
      const parent = oldVnode.parentElement
      const refElm = oldVnode.nextSibling
      const el = this.createElm(vnode)
      parent.insertBefore(el, refElm)
      parent.removeChild(oldVnode)
    } else {
      // diff
      const el = vnode.el = oldVnode.el

      if (oldVnode.tag === vnode.tag) {
        const oldCh = oldVnode.children
        const newCh = vnode.children

        if (typeof newCh === 'string') {
          if (typeof oldCh === 'string') {
            if (newCh !== oldCh) {
              el.textContent = newCh
            }
          } else {
            // text -> element
            el.textContent = newCh
          }
        } else {
          if (typeof oldCh === 'string') {
            // element -> text
            el.innerHtml = ''
            newCh.forEach((c) => {
              el.appendChild(this.createElm(c))
            })
          } else {
            this.updateChildren(el, oldCh, newCh)
          }
        }
      }
    }
  }

  updateChildren(parentElm, oldCh, newCh) {
    const len = Math.min(oldCh.length, newCh.length)
    for (let i = 0; i < len; i++) {
      this.__patch__(oldCh[i], newCh[i])
    }

    if (newCh.length > oldCh.length) {
      newCh.slice(len).forEach((c) => {
        const el = this.createElm(c)
        parentElm.appendChild(el)
      })
    } else if (newCh.length < oldCh.length) {
      oldCh.slice(len).forEach((c) => {
        parentElm.removeChild(c.el)
      })
    }
  }

  createElm(vnode) {
    const el = document.createElement(vnode.tag)
    const children = vnode.children
    if (children) {
      if (typeof children === 'string') {
        // text
        el.textContent = vnode.children
      } else {
        // elements
        children.forEach((c) => {
          el.appendChild(this.createElm(c))
        })
      }
    }
    // 创建vnode和el之间的关系
    vnode.el = el
    return el
  }

  $createElement(tag, data, children) {
    return {
      tag,
      data,
      children
    }
  }

  proxy(obj) {
    Object.keys(obj).forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return obj[key]
        },
        set(newVal) {
          if (newVal !== obj[key]) {
            obj[key] = newVal
          }
        }
      })
    })
  }
}

class Watcher {
  constructor(vm, updateFn) {
    this.vm = vm
    this.updateFn = updateFn

    this.get()
  }
  get() {
    Dep.target = this
    // 依赖收集
    this.updateFn()
    Dep.target = null
  }
  update() {
    this.updateFn.call(this.vm)
  }
}

class Dep {
  constructor() {
    this.subs = new Set()
  }
  addSub(watcher) {
    this.subs.add(watcher)
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update())
  }
}

class Observer {
  constructor(value) {
    this.value = value
    // 处理是数组还是普通对象
    this.walk(value)
  }
  walk(obj) {
    Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]))
  }
}

function defineReactive(obj, key, val) {
  observe(val)
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      // console.log('get ' + key + ' - ' + val)
      Dep.target && dep.addSub(Dep.target)
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        // console.log('set ' + key + ' - ' + newVal)
        observe(newVal)
        val = newVal
        dep.notify()
      }
    }
  })
}

function observe(obj) {
  if (typeof obj === 'object' && obj !== null) {
    new Observer(obj)
  }
}
