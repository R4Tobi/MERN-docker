<template>
  <div id="wrapper">
    <div class="form">
      <p class="form-title">Anmelden</p>
      <div class="input-container">
        <input type="email" placeholder="Benutzer">
        <span>
        </span>
      </div>
      <div class="input-container">
        <input type="password" placeholder="Passwort">
      </div>
      <button type="submit" class="submit">
        Anmelden
      </button>

      <!--<p class="signup-link">
        No account?
        <a href="/#/register">Registrieren</a>
      </p>-->
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#wrapper{
  margin: 0;
  padding: 100px;
  background: #e2e2e2;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;

  .form {
    margin-top: 200px;
    background-color: #fff;
    display: block;
    padding: 1rem;
    width: 350px;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .form-title {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    text-align: center;
    color: #000;
  }

  .input-container {
    position: relative;
  }

  .input-container input, .form button {
    outline: none;
    border: 1px solid #e5e7eb;
    margin: 8px 0;
  }

  .input-container input {
    background-color: #fff;
    padding: 1rem;
    padding-right: 3rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    width: 300px;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .submit {
    display: block;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    background-color: #4F46E5;
    color: #ffffff;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    width: 100%;
    border-radius: 0.5rem;
    text-transform: uppercase;
  }

  .signup-link {
    color: #6B7280;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: center;
  }

  .signup-link a {
    text-decoration: underline;
  }
}
</style>
