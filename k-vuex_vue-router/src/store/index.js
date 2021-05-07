import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    age: 10
  },
  getters: {
    myAge(state) {
      return state.age * 2
    }
  },
  mutations: {
    syncChange(state, payload) {
      state.age += payload
    },
    asyncChange(state, payload) {
      state.age += payload
    }
  },
  actions: {
    asyncChange({ commit }, payload) {
      setTimeout(() => {
        commit('asyncChange', payload)
      }, 1000)
    }
  },
  modules: {}
})
