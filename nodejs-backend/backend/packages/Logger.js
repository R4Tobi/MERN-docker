const fs = require("fs");

class Logging {
  //color Formatting
  neutral = "\x1b[0m";
  red = "\x1b[31m";
  green = "\x1b[32m";
  yellow = "\x1b[33m";
  blue = "\x1b[34m";
  magenta = "\x1b[35m";
  lightblue = "\x1b[36m";
  white = "\x1b[37m";

  //local variables
  writeFile = false;

  constructor() {}
  constructor(writeFile) {
    this.writeFile = writeFile;
  }

  getTimestamp(){
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
      return `[${day}.${month}.${year} ${hours}:${minutes}:${seconds},${milliseconds}]`;
  };

  writeLog(message, filename){
    fs.appendFile("../logs/" + filename, this.getTimestamp() + " " + message + "\n", function (err) {
      if (err) throw err;
    });
  };

  //Logging
  query(message) {
    console.log(this.lightblue + "QUERY   " + this.neutral + message);
    if(this.writeFile){
      this.writeLog("QUERY   " + message, "info.log");
    }
  }
  warn(message) {
    console.log(this.yellow + "WARN    " + this.neutral + message);
    if(this.writeFile){
      this.writeLog("WARN " + message, "warn.log");
    }
  }
  error(message) {
    console.log(this.red + "ERROR   " + this.neutral + message);
    if(this.writeFile){
      this.writeLog("ERROR " + message, "error.log");
    }
  }
  success(message) {
    console.log(this.green + "SUCCESS " + this.neutral + message);
    if(this.writeFile){
      this.writeLog("SUCCESS " + message, "info.log");
    }
  }
  info(message) {
    console.log(this.blue + "INFO    " + this.neutral + message);
    if(this.writeFile){
      this.writeLog("INFO    " + message, "info.log");
    }
  }
  dev(message) {
    console.log(this.magenta + "DEV     " + this.neutral + message);
    if(this.writeFile){
      this.writeLog("DEV " + message, "dev.log");
    }
  }
  session(message) {
    console.log(this.lightblue + "SESSION " + this.neutral + message);
    if(this.writeFile){
      this.writeLog("SESSION " + message, "session.log");
    }
  }
  register(message) {
    console.log(this.green + "REGISTER" + this.neutral + message);
    if(this.writeFile){
      this.writeLog("REGISTER" + message, "info.log");
    }
  }
}

module.exports = Logging;