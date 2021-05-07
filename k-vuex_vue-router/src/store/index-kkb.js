import Vue from 'vue'
// import Vuex from './k-vuex'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0
  },
  getters: {
    doubleCounter: (state) => {
      return state.counter * 2
    },
    tripleCounter: (state) => {
      return state.counter * 3
    }
  },
  mutations: {
    add(state) {
      state.counter++
    }
  },
  actions: {
    add({ commit }) {
      setTimeout(() => {
        commit('add')
      }, 500)
    }
  },
  modules: {}
})
