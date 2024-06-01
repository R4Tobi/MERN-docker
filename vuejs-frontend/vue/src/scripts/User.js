import Cookie from "./Cookie.js";

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      // Return the Promise
      const url = "http://localhost/api/login";
      const httpRequest = new XMLHttpRequest();

      httpRequest.open("POST", url);
      httpRequest.setRequestHeader(
        "Content-Type",
        "application/json;charset=UTF-8"
      );

      httpRequest.send(
        JSON.stringify({
          username: username,
          password: password,
          lang: "de"
        })
      );

      httpRequest.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            new Cookie().setCookie("username", username, Date.now() + 30*60*1000);
            new Cookie().setCookie("sessionID", JSON.parse(this.response).sessionID, Date.now() + 30*60*1000);
            resolve({ 
              type: "erfolg", 
              message: "Anmeldung erfolgreich" 
            });
          } else {
            reject({
              type: "fehler",
              message: "Benutzername oder Passwort falsch"
            }); // Reject the promise for error cases
          }
        }
      };

      httpRequest.onerror = function () {
        reject({
          type: "fehler",
          message: "Fehler bei der Netzwerkverbindung/Anfrage"
        }); // Handle network errors
      };
    });
  }
  logout(){
    return new Promise((resolve, reject) => {
      // Return the Promise
      const url = "http://localhost/api/logout";
      const httpRequest = new XMLHttpRequest();

      httpRequest.open("POST", url);
      httpRequest.setRequestHeader(
        "Content-Type",
        "application/json;charset=UTF-8"
      );

      const sessionID = new Cookie().getCookie("sessionID");
      const user = new Cookie().getCookie("username");
      httpRequest.send(JSON.stringify({ sessionID: sessionID, username: user }));

      httpRequest.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            new Cookie().deleteCookie("username");
            resolve({ 
              type: "erfolg", 
              message: "Abmeldung erfolgreich" 
            });
          } else {
            reject({
              type: "fehler",
              message: "Fehler bei der Abmeldung"
            }); // Reject the promise for error cases
          }
        }
      };

      httpRequest.onerror = function () {
        reject({
          type: "fehler",
          message: "Fehler bei der Netzwerkverbindung/Anfrage"
        }); // Handle network errors
      };
    });
  }
  register(username,fullName, password, password_c) {
    return new Promise((resolve, reject) => {
      // Return the Promise
      if(password !== password_c){
        reject({
          type: "fehler",
          message: "Die Passwörter stimmen nicht überein"
        });
      }
      const url = "http://localhost/api/register";
      const httpRequest = new XMLHttpRequest();

      httpRequest.open("POST", url);
      httpRequest.setRequestHeader(
        "Content-Type",
        "application/json;charset=UTF-8"
      );

      httpRequest.send(
        JSON.stringify({
          username: username,
          fullName: fullName,
          password: password,
          password_c: password_c,
          lang: "de"
        })
      );

      httpRequest.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            resolve({ 
              type: "erfolg", 
              message: "Registrierung erfolgreich" 
            });
          } else if (this.status === 409){
            reject({
              type: "fehler",
              message: "Der Benutzername existiert bereits"
            }); // Reject the promise for error cases
          } else if (this.status === 406){
            reject({
              type: "fehler",
              message: JSON.parse(this.response).errdsc
            });
          }
        }
      };

      httpRequest.onerror = function () {
        reject({
          type: "fehler",
          message: "Fehler bei der Netzwerkverbindung/Anfrage"
        }); // Handle network errors
      };
    });
  }
  async checkAuth(){
    return new Promise((resolve, reject) => {
      // Return the Promise
      const url = "http://localhost/api/session";
      const httpRequest = new XMLHttpRequest();

      httpRequest.open("POST", url);
      httpRequest.setRequestHeader(
        "Content-Type",
        "application/json;charset=UTF-8"
      );
      httpRequest.setRequestHeader(
        "Access-Control-Allow-Origin",
        "http://localhost:8080"
      );

      const user = new Cookie().getCookie("username");
      const sessionID = new Cookie().getCookie("sessionID");
      httpRequest.send(JSON.stringify({ sessionID: sessionID, username: user }));

      httpRequest.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            resolve({
              type: "erfolg",
              message: "Sitzung ist gültig",
              validUntil: JSON.parse(this.response).validUntil
            });
          } else if(this.status === 401){
            reject({
              type: "fehler",
              message: "Sitzung ist abgelaufen"
            }); // Reject the promise for error cases
          }
        }
      };
    });
  }
  getProfile(){
    return new Promise((resolve, reject) => {
      // Return the Promise
      const url = "http://localhost/api/profile";
      const httpRequest = new XMLHttpRequest();

      httpRequest.open("POST", url);
      httpRequest.setRequestHeader(
        "Content-Type",
        "application/json;charset=UTF-8"
      );
      httpRequest.setRequestHeader(
        "Access-Control-Allow-Origin",
        "http://localhost:8080"
      );

      const user = new Cookie().getCookie("username");
      const sessionID = new Cookie().getCookie("sessionID");
      httpRequest.send(JSON.stringify({ sessionID: sessionID, username: user }));

      httpRequest.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            resolve(JSON.parse(this.response));
          } else if(this.status === 401){
            reject({
              type: "fehler",
              message: "Sitzung ist abgelaufen"
            }); // Reject the promise for error cases
          }
        }
      };
    });
  }
}

export default User;
