class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.$el = document.querySelector(options.el)
    // 数据代理
    this.proxy(options.data)
    // 数据响应式
    observe(options.data)
    // 编译
    new Compiler(this.$el, this)
  }
  proxy(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newValue) {
          data[key] = newValue
        }
      })
    })
  }
}

function observe(data) {
  if (typeof data !== 'object' || data === null) {
    return
  }
  new Observer(data)
}

function defineReactive(obj, key, value) {
  observe(value)
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      // console.log('get key - ', value)
      window.watcher && dep.addSub(window.watcher)
      return value
    },
    set(newValue) {
      if (newValue !== value) {
        // console.log('set key - ', newValue)
        value = newValue
        dep.notify()
      }
    }
  })
}

class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
  }
}

class Compiler {
  constructor(el, vm) {
    this.vm = vm
    this.compile(el)
  }
  compile(el) {
    const childNodes = Array.from(el.childNodes)
    childNodes.forEach((node) => {
      if (this.isElement(node)) {
        const attrs = Array.from(node.attributes)
        attrs.forEach((attr) => {
          // v-html
          const directive = attr.name
          // desc
          const exp = attr.value
          if (this.isDirective(directive)) {
            // html
            const update = directive.slice(2)
            this[update] && this[update](node, exp)
          } else if (this.isEvent(directive)) {
            // click
            const update = directive.slice(1)
            node.addEventListener(update, () => {
              this.vm.$options.methods[exp].call(this.vm)
            })
          }
        })
      } else if (this.isInter(node)) {
        const exp = RegExp.$1.trim()
        this.compileText(node, exp)
      }
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }
  update(node, directive, exp) {
    const fn = this[directive + 'Updater']
    fn && fn(node, this.vm[exp])

    // 创建Watcher
    new Watcher(this.vm, exp, (value) => {
      fn && fn(node, value)
    })
  }
  isElement(node) {
    return node.nodeType === 1
  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  isEvent(attrName) {
    return attrName.startsWith('@')
  }
  compileText(node, exp) {
    this.update(node, 'text', exp)
  }
  textUpdater(node, value) {
    node.textContent = value
  }
  htmlUpdater(node, value) {
    node.innerHTML = value
  }
  text(node, exp) {
    this.update(node, 'text', exp)
  }
  html(node, exp) {
    this.update(node, 'html', exp)
  }
}

class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    window.watcher = this
    this.vm[key]
    window.watcher = null
  }
  update() {
    this.cb(this.vm[this.key])
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
