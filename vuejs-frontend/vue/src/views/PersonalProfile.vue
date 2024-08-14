<template>
    <div id="wrapper">
      <h1>Hallo {{ this.profile.fullName }}.</h1>
      <h2>persönliche Daten:</h2>
      <table>
        <tr><td>Name: </td><td>{{ this.profile.fullName }}</td></tr>
        <tr><td>Benutzername: </td><td>{{ this.profile.username }}</td></tr>
        <tr><td>Rollen:</td><td><span v-for="role in this.profile.role" :key="role">{{ role }}, </span></td></tr>
        <tr><td>Session:</td><td>gültig bis: {{ Date(this.profile.expires).toLocaleUpperCase }}</td></tr>
      </table>
      <button @click="logout">Logout</button>
    </div>
</template>

<script>
import User from "../scripts/User.js";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'PersonalProfile',
  data: () => {
    return {
      count: 0,
      profile: {
        fullName: null,
        username: null,
        role: []
      },
      loggedIn: false,
      sessionValidUntil: null
    }
  },
  methods: {
    init(){
      this.getProfile();
    },
    getProfile(){
      new User().getProfile()
      .then(
        (data) => {
          this.profile = data;
          if(data.role.includes("admin")){
            this.$router.push("/admin");
          }
        }
      )
    },
    logout(){
      new User().logout()
      .then(window.open("/#/home?message=logoutSuccess", "_self"))
    }
  },
  mounted(){
    this.init();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../stylesheets/main.scss";
</style>
