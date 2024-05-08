class Cookie {
  constructor(name, value, exp) {
    this.name = name;
    this.value = value;
    this.exp = exp;
  }

  setCookie(name, value, exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie =
      name + "=" + value + ";" + expires + ";path=/; SameSite=Lax;";
  }

  getCookie(name) {
    let cname = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(cname) === 0) {
        return c.substring(cname.length, c.length);
      }
    }
    return "";
  }

  deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}

export default Cookie;
