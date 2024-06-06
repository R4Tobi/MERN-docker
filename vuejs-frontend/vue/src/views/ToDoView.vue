
<template>
  <div id="wrapper">

  </div>
</template>

<script>
import User from "../scripts/User.js";
//import Toast from "../scripts/Toast.js";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'ToDoView',
  methods: {
    init(){
      this.checkAuth();
    },
    checkAuth(){
      new User().checkAuth()
      .then(
        (data) => {
          this.loggedIn = true;
          this.sessionValidUntil = new String(new Date(data.validUntil).getHours()).padStart(2, 0) + ":" + new String(new Date(data.validUntil).getMinutes()).padStart(2, 0) + ":" + new String(new Date(data.validUntil).getSeconds()).padStart(2, 0);
        },
        () => {window.open("/#/home?message=sessionExpired", "_self")}
      );
    },
  },
  mounted(){
    this.init();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../stylesheets/main.scss"
</style>
