class Logging {
  constructor() {}

  //color Formatting
  neutral = "\x1b[0m";
  red = "\x1b[31m";
  green = "\x1b[32m";
  yellow = "\x1b[33m";
  blue = "\x1b[34m";
  magenta = "\x1b[35m";
  lightblue = "\x1b[36m";
  white = "\x1b[37m";



  //Logging
  query(message) {
    console.log(this.lightblue + "QUERY..." + this.neutral + message);
  }
  warn(message) {
    console.log(this.yellow + "WARN...." + this.neutral + message);
  }
  error(message) {
    consoele.log(this.red + "ERROR..." + this.neutral + message);
  }
  success(message) {
    console.log(this.green + "SUCCESS " + this.neutral + message);
  }
  info(message) {
    console.log(this.blue + "INFO...." + this.neutral + message);
  }
  dev(message) {
    console.log(this.magenta + "DEV....." + this.neutral + message);
  }
  session(message) {
    console.log(this.lightblue + "SESSION " + this.neutral + message);
  }
  register(message) {
    console.log(this.green + "REGISTER" + this.neutral + message);
  }
}

module.exports = Logging;