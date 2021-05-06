const originProto = Array.prototype
const arrProto = Object.create(originProto)

;['push'].forEach((method) => {
  arrProto[method].apply(this, arguments)
  // 派发更新
  console.log('触发了' + method + '方法')
})

function defineReactive(obj, key, val) {
  observe(val)
  Object.defineProperty(obj, key, {
    get() {
      console.log('get ' + key + ' - ' + val)
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        console.log('set ' + key + ' - ' + newVal)
        observe(newVal)
        val = newVal
      }
    }
  })
}

function observe(obj) {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      obj.__proto__ = arrProto
    } else {
      Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]))
    }
  }
}

function set(obj, key, val) {
  defineReactive(obj, key, val)
}

const obj = {
  foo: 'foo',
  bar: {
    baz: 'baz'
  },
  arr: ['1', '2']
}

observe(obj)
// defineReactive(obj, 'foo', 'foo')

// obj.foo = 'change foo'
// obj.bar = 'change bar'
// obj.bar.baz = 'change baz'
// obj.bar = {
//   a: 'a'
// }
// obj.bar.a

// obj.new = 'new'
// set(obj, 'new', 'new')
// obj.new
// obj.arr[1] = '11'
obj.arr.push(3)
