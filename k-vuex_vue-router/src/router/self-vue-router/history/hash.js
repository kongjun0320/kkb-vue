import History from './base'

function getHash() {
  return window.location.hash.slice(1)
}

function ensureSlash() {
  if (!window.location.hash) {
    window.location.hash = '/'
  }
}

export default class HashHistory extends History {
  constructor(router) {
    super(router)
    ensureSlash()
  }
  getCurrentLocation() {
    return getHash()
  }
  setupHashListener() {
    window.addEventListener('hashchange', () => {
      this.transitionTo(getHash())
    })
  }
}
