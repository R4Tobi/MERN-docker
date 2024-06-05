<template>
  <div>
    <NavHeader />
    <router-view />
  </div>
</template>

<script>
import NavHeader from './components/NavHeader.vue'
//import NavFooter from './components/NavFooter.vue'

export default {
  name: 'App',
  components: {
    NavHeader,
    //NavFooter,
  }
}
</script>

<style>
*{
  box-sizing: border-box;
}

html, body{
  margin: 0;
  padding: 0;
  background: #292929;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
