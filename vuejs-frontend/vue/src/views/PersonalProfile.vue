<template>
    <div class="wrapper">
        Persönlichers Profil
    </div>
</template>

<script>
import Cookie from "../scripts/Cookie.js";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'PersonalProfile',
  methods: {
    init(){
      this.checkLogin();
    },
    checkLogin(){
      const cookie = new Cookie().getCookie("authenticated");
      if(cookie != "true"){
        window.open("/#/home", "_self")
      }
    }
  },
  mounted(){
    this.init();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>

</style>
