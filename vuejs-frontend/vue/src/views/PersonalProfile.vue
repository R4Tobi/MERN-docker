<template>
    <div id="wrapper">
      <h1>Persönliches Profil</h1>
      <table>
        <tr><td>Name: </td><td>{{ this.profile.fullName }}</td></tr>
        <tr><td>Benutzername: </td><td>{{ this.profile.username }}</td></tr>
        <tr><td>Rollen:</td><td>{{ this.profile.roles }}</td></tr>
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
        roles: []
      },
      loggedIn: false
    }
  },
  methods: {
    init(){
      this.checkAuth();
      this.getProfile();
    },
    checkAuth(){
      new User().checkAuth()
      .then(
        () => {this.loggedIn = true},
        () => {window.open("/#/home?message=sessionExpired", "_self")}
      );
    },
    getProfile(){
      new User().getProfile()
      .then(
        (data) => this.profile = data
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
