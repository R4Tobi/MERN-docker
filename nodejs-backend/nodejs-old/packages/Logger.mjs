import { mkdirSync, writeFileSync, appendFile } from "fs";

/**
 * Represents a logging utility.
 */
class Logger {
  //color Formatting
  neutral = "\x1b[0m";
  red = "\x1b[31m";
  green = "\x1b[32m";
  yellow = "\x1b[33m";
  blue = "\x1b[34m";
  magenta = "\x1b[35m";
  lightblue = "\x1b[36m";
  white = "\x1b[37m";

  /**
   * Creates an instance of Logger.
   * @param {boolean} writeFile - Indicates whether to write logs to files.
   */
  constructor(writeFile = true) {
    this.writeFile = writeFile;
    if (this.writeFile) {
      try {
        mkdirSync("./logs", { recursive: true }, (err) => {
          if (err) throw err;
        });
        writeFileSync("./logs/info.log", "", function (err) {
          if (err) throw err;
        });
        writeFileSync("./logs/warn.log", "", function (err) {
          if (err) throw err;
        });
        writeFileSync("./logs/error.log", "", function (err) {
          if (err) throw err;
        });
        writeFileSync("./logs/dev.log", "", function (err) {
          if (err) throw err;
        });
        writeFileSync("./logs/session.log", "", function (err) {
          if (err) throw err;
        });
      } catch (e) {
        new Logger(false).error(
          "creating log files failed (maybe needs just a restart, otherwise check permissions for Using filesystem) with " +
            e
        );
      }
    }
  }

  /**
   * Gets the current timestamp in the format [dd.mm.yyyy hh:mm:ss,mmm].
   * @returns {string} The formatted timestamp.
   */
  getTimestamp() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
    return `[${day}.${month}.${year} ${hours}:${minutes}:${seconds},${milliseconds}]`;
  }

  /**
   * Writes a log message to a file.
   * @param {string} message - The log message to write.
   * @param {string} filename - The name of the log file.
   */
  writeLog(message, filename) {
    appendFile(
      "./logs/" + filename,
      this.getTimestamp() + " " + message + "\n",
      function (err) {
        if (err) throw err;
      }
    );
  }

  //Logging

  /**
   * Logs a query message to the console and optionally to a file.
   * @param {string} message - The query message to log.
   */
  query(message) {
    console.log(this.lightblue + "QUERY   " + this.neutral + message);
    if (this.writeFile) {
      this.writeLog("QUERY   " + message, "info.log");
    }
  }

  /**
   * Logs a warning message to the console and optionally to a file.
   * @param {string} message - The warning message to log.
   */
  warn(message) {
    console.log(this.yellow + "WARN    " + this.neutral + message);
    if (this.writeFile) {
      this.writeLog("WARN " + message, "warn.log");
    }
  }

  /**
   * Logs an error message to the console and optionally to a file.
   * @param {string} message - The error message to log.
   */
  error(message) {
    console.log(this.red + "ERROR   " + this.neutral + message);
    if (this.writeFile) {
      this.writeLog("ERROR " + message, "error.log");
    }
  }

  /**
   * Logs a success message to the console and optionally to a file.
   * @param {string} message - The success message to log.
   */
  success(message) {
    console.log(this.green + "SUCCESS " + this.neutral + message);
    if (this.writeFile) {
      this.writeLog("SUCCESS " + message, "info.log");
    }
  }

  /**
   * Logs an info message to the console and optionally to a file.
   * @param {string} message - The info message to log.
   */
  info(message) {
    console.log(this.blue + "INFO    " + this.neutral + message);
    if (this.writeFile) {
      this.writeLog("INFO    " + message, "info.log");
    }
  }

  /**
   * Logs a dev message to the console and optionally to a file.
   * @param {string} message - The dev message to log.
   */
  dev(message) {
    console.log(this.magenta + "DEV     " + this.neutral + message);
    if (this.writeFile) {
      this.writeLog("DEV " + message, "dev.log");
    }
  }

  /**
   * Logs a session message to the console and optionally to a file.
   * @param {string} message - The session message to log.
   */
  session(message) {
    console.log(this.lightblue + "SESSION " + this.neutral + message);
    if (this.writeFile) {
      this.writeLog("SESSION " + message, "session.log");
    }
  }

  /**
   * Logs a register message to the console and optionally to a file.
   * @param {string} message - The register message to log.
   */
  register(message) {
    console.log(this.green + "REGISTER" + this.neutral + message);
    if (this.writeFile) {
      this.writeLog("REGISTER" + message, "info.log");
    }
  }
}

export default Logger;
