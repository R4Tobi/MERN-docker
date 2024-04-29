<template>
  <div id="wrapper">
    <div class="form">
      <p class="form-title">Anmelden</p>
      <div class="input-container">
        <input type="text" id="username" placeholder="Benutzername">
        <span>
        </span>
      </div>
      <div class="input-container">
        <input type="password" id="password" placeholder="Passwort">
      </div>
      <button @click="this.login()" class="submit">
        Anmelden
      </button>

      <p class="signup-link">
        Noch kein Konto?
        <a href="/#/register">Registrieren</a>
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
    checkQuery(){
      const searchParams = new URLSearchParams(window.location.toString().split("?")[1]);
      const message = searchParams.get('message');
      switch(message){
        case "registrationSuccessful":
          new Toast().showAlert({type: "erfolg", message: "Registrierung erfolgreich. Sie können sich jetzt anmelden."});
          break;
        case "sessionExpired":
          new Toast().showAlert({type: "info", message: "Ihre Sizung ist abgelaufen oder ungültig. Melden Sie sich erneut an."});
          break;
        default:
          break;
      }
    },
    login(){
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
      new User().login(username, password)
      .then(
        (data) => {
          new Toast().showAlert(data);
          window.open("/#/profile", "_self")
        },
        (data) => {
          new Toast().showAlert(data);
        }
      );
    }
  },
  mounted(){
    this.checkQuery();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../stylesheets/main.scss"
</style>
