export default {
  functional: true,
  render(h, { parent, data }) {
    const route = parent.$route
    const matched = route.matched

    data.routerView = true
    let depth = 0

    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      parent = parent.$parent
    }

    const record = matched[depth]
    if (!record) {
      return h(null)
    }

    const component = record.component
    return h(component, data)
  }
}
