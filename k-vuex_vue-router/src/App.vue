<template>
  <div id="app">
    <!-- vuex demo - zf -->
    <p>珠峰的年龄: {{ $store.state.age }}</p>
    <p>我的年龄: {{ $store.getters.myAge }}</p>
    <button @click="syncChange">同步更改</button>
    <button @click="asyncChange">异步更改</button>
    <!-- vuex demo - kkb -->
    <!-- <p @click="$store.commit('add')">sync {{ $store.state.counter }}</p>
    <p @click="$store.dispatch('add')">async {{ $store.state.counter }}</p>
    <p>doubleCounter: {{ $store.getters.doubleCounter }}</p>
    <p>tripleCounter: {{ $store.getters.tripleCounter }}</p> -->
    <!-- vue-router demo -->
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view /> -->
  </div>
</template>
<script>
export default {
  name: 'App',
  methods: {
    syncChange() {
      this.$store.commit('syncChange', 10)
    },
    asyncChange() {
      this.$store.dispatch('asyncChange', 5)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
