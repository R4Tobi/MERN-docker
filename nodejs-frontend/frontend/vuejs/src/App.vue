<template>
  <NavHeader />
  <router-view></router-view>
  <NavFooter />
</template>

<script>
import NavHeader from "./components/static/NavHeader.vue"
import NavFooter from "./components/static/NavFooter.vue"

export default {
  name: 'App',
  components: {
    NavHeader,
    NavFooter
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
  margin-top: 60px;
}
</style>
