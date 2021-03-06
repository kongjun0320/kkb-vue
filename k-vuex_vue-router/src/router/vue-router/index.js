import createMatcher from './create-matcher'
import HashHistory from './history/hash'
import install from './install'

export default class VueRouter {
  constructor(options) {
    // 将用户传递的路由配置参数转换成Map结构
    this.matcher = createMatcher(options.routes || [])
    // 创建路由系统
    this.mode = options.mode || 'hash'
    this.history = new HashHistory(this)
  }
  init(app) {
    const history = this.history
    const setupHashListener = () => {
      history.setupHashListener()
    }
    history.transitionTo(history.getCurrentLocation(), setupHashListener)
    // 响应式
    history.listen((route) => {
      app._route = route
    })
  }
  match(location) {
    return this.matcher.match(location)
  }
}

VueRouter.install = install
