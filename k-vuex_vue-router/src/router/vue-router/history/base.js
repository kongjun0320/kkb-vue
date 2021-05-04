export function createRoute(record, location) {
  let res = []
  if (record) {
    while (record) {
      res.unshift(record)
      record = record.parent
    }
  }
  return {
    ...location,
    matched: res
  }
}

export default class History {
  constructor(router) {
    this.router = router

    this.current = createRoute(null, {
      path: '/'
    })
  }
  transitionTo(location, onComplete) {
    const route = this.router.match(location)
    // 初始化的时候 path都是'/' 因此需要第二个判断
    if (
      this.current.path === location &&
      route.matched.length === this.current.matched.length
    ) {
      return
    }
    this.updateRoute(route)
    onComplete && onComplete()
  }
  updateRoute(route) {
    this.current = route
    this.cb && this.cb(route)
  }
  listen(cb) {
    this.cb = cb
  }
}
