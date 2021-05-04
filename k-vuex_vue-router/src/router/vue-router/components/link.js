export default {
  functional: true,
  render(h, { props, slots }) {
    return h(
      'a',
      {
        attrs: {
          href: `#${props.to}`
        }
      },
      slots().default
    )
  }
}
