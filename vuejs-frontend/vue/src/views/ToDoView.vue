
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
      this.getToDo();
    },
    getToDo(){
      var user = new User();
      user.getToDo().then((response) => {
        console.log(response);
      });
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
