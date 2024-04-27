<template>
    <div class="wrapper">
        Persönlichers Profil
    </div>
</template>

<script>
import User from "../scripts/User.js";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'PersonalProfile',
  methods: {
    init(){
      this.checkAuth();
    },
    checkAuth(){
      new User().checkAuth()
      .then(
        (data) => {console.log(data)},
        () => {window.open("/#/home?message=sessionExpired")}
      );
    }
  },
  mounted(){
    this.init();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
@import "../stylesheets/main.scss";
</style>
