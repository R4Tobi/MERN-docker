<template>
  <div id="wrapper">
    <div class="form">
      <p class="form-title">Anmelden</p>
      <div class="input-container">
        <input type="text" id="username" placeholder="Benutzername">
      </div>
      <div class="input-container">
        <input type="text" id="fullname" placeholder="Voller Name">
      </div>
      <div class="input-container">
        <input type="password" id="password" placeholder="Passwort">
      </div>
      <div class="input-container">
        <input type="password" id="password_c" placeholder="Passwort bestätigen">
      </div>
      <button @click="this.register()" class="submit">
        Registrieren
      </button>

      <p class="signup-link">
        Bereits einen Account?
        <a href="/#/login">Anmelden</a>
      </p>
    </div>
  </div>
</template>

<script>
import User from "../scripts/User.js";
import Toast from "../scripts/Toast.js";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  methods: {
    register(){
      const username = document.querySelector("#username").value;
      const fullName = document.querySelector("#fullname").value;
      const password = document.querySelector("#password").value;
      const password_c = document.querySelector("#password_c").value;
      new User().register(username, fullName, password, password_c)
      .then(
        () => {
          setTimeout(() => window.open("/#/home?message=registrationSuccessful", "_self"));
        },
        (data) => {
          new Toast().showAlert(data);
        }
      );
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../stylesheets/main.scss";
</style>
