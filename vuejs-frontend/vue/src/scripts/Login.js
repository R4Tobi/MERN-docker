

class Login {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  login(username, password) {
    var url = "localhost:8080/api/login";
    var httpRequest = new XMLHttpRequest();

    httpRequest.open("POST", url);
    httpRequest.setRequestHeader(
      "Content-Type",
      "application/json;charset=UTF-8"
    );
    httpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");

    httpRequest.send(
      JSON.stringify({
        username: username,
        password: password,
        lang: "de"
      })
    );

    /*httpRequest.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {

      }

      if (this.readyState === 4 && this.status !== 200) {
        callback(false);
      }
    };*/
  }
}

export default Login;
