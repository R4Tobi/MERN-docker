const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

// Set up Global configuration access

/**
 * @classdesc Repräsentiert die Aktionen die mit Benutzerprozessen zusammenhängen. Dazu zählen Authentifizierung, Autorisierung, Registrierung, Profildatenänderung und Passwortänderung.
 * @class
 */
module.exports = class User {
  constructor(config) {
    try {
        const dbconn = `mongodb://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}`;
        this.database = new MongoClient(dbconn, {
          pkFactory: { createPk: () => new UUID.toBinary() }
        });
    }catch(e){
      console.log("config not found");
    }
  }
  /**
   * Registriert einen neuen Benutzer.
   * @param {Object} req - Das Anfrageobjekt.
   * @param {Object} res - Das Antwortobjekt.
   * @param {Function} next - Die nächste Middleware-Funktion.
   * @returns {Object} HTTP-Status, ggf. Fehlermeldung
   */
  async register(req, res, next) {
    const data = req.body;

    const password_valid = data.password == data.password_c;
    const data_valid =
      data.username.length > 1 &&
      data.password.length > 7 &&
      data.fullName.length > 1;

    if (data_valid && password_valid) {
      if (data.username.includes(":")) {
        res.status(400).json({
          message: "Bad Request",
          error: "invalid character in username",
          errno: 103
        });
      }
      // Get the accounts collection of the MongoDB database
      const collection = this.database.db("main").collection("accounts");
      // Hash password
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(data.password, salt);
      // Insert new account into collection
      try {
        const result = await collection.insertOne({
          _id: data.username,
          username: data.username,
          password: hash,
          fullName: data.fullName,
          role: ["user"]
        });
        res.status(200).send(JSON.stringify({ message: "Success" }));
        console.register(
          `New Account added to MongoDB. ID: ${result.insertedId}`
        );
      } catch (e) {
        const errno = e.message.substring(0, 5);
        switch (errno) {
          case "E1100":
            res.status(409).json({
              message: "Bad Request",
              error: "username is already used",
              errno: 102
            });
            break;
          default:
            next();
        }
      }
    } else {
      let errdsc = "";
      let errstatus = 0;
      if (!password_valid) {
        errdsc += "Die Passwörter stimmen nicht überein. ";
        errstatus = 406;
      }
      if (!data_valid) {
        errdsc +=
          "Die angegebenen Daten entsprechen nicht den Richtlinien. Mindestens 8 zeichen, 2 zeichen für einen Benutzernamen.";
        errstatus = 406;
      }

      res.status(errstatus).json({
        message: "Bad Request",
        error: errdsc,
        errno: 101
      });
    }
  }
  /**
   * Meldet einen Benutzer an.
   * @param {Object} req - Das Anfrageobjekt.
   * @param {Object} res - Das Antwortobjekt.
   * @param {Function} next - Die nächste Middleware-Funktion.
   */
  async login(req, res, next) {
    let xRealIP = req.headers["x-real-ip"];
    let xRemoteHost = req.headers["x-remote-host"];
    let username = req.body.username;
    let password = req.body.password;

    // Get the accounts collection of the MongoDB database
    const collection = this.database.db("main").collection("accounts");
    // Find user and compare passwords
    const user = await collection.findOne({ username: username });
    if (user === null) {
      res.status(403).json({
        message: "Bad Credentials",
        error: "wrong username or password",
        errno: 201
      });
      return;
    }
    // Compare hash values
    const result = bcrypt.compareSync(password, user.password);
    if (result === true) {
      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      let data = {
        time: Date(),
        userId: user._id,
        username: user.username,
      };

      const token = jwt.sign(data, jwtSecretKey);

      res.status(200).cookie( "jwt", token, {
        domain: "localhost",
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 1000 * 60 * 60)
      }).json({
        message: "Success"
      });
    } else {
      res.status(403).send(
        JSON.stringify({
          message: "Bad Credentials",
          error: "wrong username or password",
          errno: 201
        })
      );
    }
  }

  /**
   * Meldet einen Benutzer ab.
   * @param {Object} req - Das Anfrageobjekt.
   * @param {Object} res - Das Antwortobjekt.
   * @param {Function} next - Die nächste Middleware-Funktion.
   */
  async logout(req, res, next) {
    res.clearCookie( "jwt", {
      path: '/',
    });
  }

  async auth(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          res.status(401).send("Unauthorized");
        } else {
          const newToken = jwt.sign(decoded, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h"
          });
          next();
        }
      });
    } else {
      res.status(401).send("Unauthorized");
    }
  }

  async profile(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
      await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
          res.status(401).send("Unauthorized");
        } else {
          const collection = this.database.db("main").collection("accounts");
          const user = await collection.findOne({ _id: decoded.username });
          console.log(user);
          res.status(200).send(JSON.stringify(user));
        }
      });
    } else {
      res.status(401).send("Unauthorized");
    }
  }
}