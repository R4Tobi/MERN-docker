<template>
    <div id="wrapper">
      <h1>Hallo {{ this.profile.fullName }}.</h1>
      <h2>persönliche Daten:</h2>
      <table>
        <tr><td>Name: </td><td>{{ this.profile.fullName }}</td></tr>
        <tr><td>Benutzername: </td><td>{{ this.profile.username }}</td></tr>
        <tr><td>Rollen:</td><td><span v-for="role in this.profile.role" :key="role">{{ role }}, </span></td></tr>
        <tr><td>Session:</td><td>gültig bis: {{ this.sessionValidUntil }}</td></tr>
      </table>
      <h2>Systeminformationen</h2>
      <table>
        
      </table>
      <h2>Auslastung und Temperaturen (Live)</h2>
      <table>

      </table>
      <button @click="logout">Logout</button>
    </div>
</template>

<script>
import User from "../scripts/User.js";
import Cookie from "../scripts/Cookie.js";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'AdminProfile',
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
      this.checkAuth();
      this.getProfile();
      this.getSystemInfo();
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
    getProfile(){
      new User().getProfile()
      .then(
        (data) => {
          this.profile = data;
        }
      )
    },
    getSystemInfo(){
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("POST", "/api/systeminfo", true);
        httpRequest.setRequestHeader(
            "Content-Type",
            "application/json;charset=UTF-8"
        );
        httpRequest.send(JSON.stringify({
            sessionID: new Cookie().getCookie("sessionID")
        }));
        httpRequest.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    const data = JSON.parse(this.responseText);
                    console.log(data);
                }
            }
        }
        //setTimeout(this.getSystemInfo(), 1000);
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
