class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.$methods = options.methods

    this.proxy(options.data)
    observe(options.data)
    new Compiler(options.el, this)
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
  constructor(vm, key, updateFn) {
    this.vm = vm
    this.key = key
    this.updateFn = updateFn

    Dep.target = this
    // 触发get 为了去收集依赖
    this.vm[this.key]
    Dep.target = null
  }
  update() {
    this.updateFn && this.updateFn.call(this.vm, this.vm[this.key])
  }
}

class Dep {
  constructor() {
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update())
  }
}

class Compiler {
  constructor(el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm

    this.compile(this.$el)
  }
  compile(el) {
    Array.from(el.childNodes).forEach((node) => {
      if (this.isElement(node)) {
        // console.log('element: ', node)
        this.compileElement(node)
      } else if (this.isInter(node)) {
        // console.log('interpolation: ', node)
        this.compileText(node)
      }
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }
  compileElement(node) {
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach((attr) => {
      const attrName = attr.name
      const expr = attr.value
      if (this.isDirective(attrName)) {
        const update = attrName.slice(2)
        this[update] && this[update](node, expr)
      } else if (this.isEvent(attrName)) {
        const eventName = attrName.slice(1)
        node.addEventListener(eventName, () => {
          this.$vm.$methods[expr].call(this.$vm)
        })
      }
    })
  }
  text(node, expr) {
    this.update(node, expr, 'text')
  }
  html(node, expr) {
    this.update(node, expr, 'html')
  }
  model(node, expr) {
    this.update(node, expr, 'model')

    node.addEventListener('input', (e) => {
      this.$vm[expr] = e.target.value
    })
  }
  update(node, expr, dir) {
    // 初始化
    const fn = this[dir + 'Updater']
    fn && fn(node, this.$vm[expr])
    // 更新
    new Watcher(this.$vm, expr, function (value) {
      fn && fn(node, value)
    })
  }
  modelUpdater(node, value) {
    node.value = value
  }
  htmlUpdater(node, value) {
    node.innerHTML = value
  }
  textUpdater(node, value) {
    node.textContent = value
  }
  compileText(node) {
    const expr = RegExp.$1.trim()
    this.update(node, expr, 'text')
  }
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  isEvent(attrName) {
    return attrName.startsWith('@')
  }
  isElement(node) {
    return node.nodeType === 1
  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
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
