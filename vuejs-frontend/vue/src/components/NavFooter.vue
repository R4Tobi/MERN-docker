<template>
  <footer class="reveal">
    <hr class="first" />
    <div class="urls">
      <div class="container">
        <h3>Seitenlinks</h3>
        <ul>
          <li><router-link to="/profile">Profil</router-link></li>
        </ul>
      </div>
    </div>
    <hr class="second" />
    <p>&#169; Copyright 2023, "To Be. Web Solutions"/Tobias Baake </p>
  </footer>
</template>

<script>
export default {
  name: "NavFooter"
};

function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 0;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../stylesheets/nav.scss";
</style>
