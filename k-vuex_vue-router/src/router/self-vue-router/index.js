import createMatcher from './create-matcher'
import HashHistory from './history/hash'
import install from './install'

export default class VueRouter {
  constructor(options) {
    // 匹配器
    this.matcher = createMatcher(options.routes)
    // 路由系统
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
    console.log(this.matcher.match(location))
    return this.matcher.match(location)
  }
}

VueRouter.install = install
