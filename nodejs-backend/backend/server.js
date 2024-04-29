/*
 * Imports
 */
var express = require("express");
var session = require("express-session");
var cors = require("cors");
var bcrypt = require("bcrypt");
var fs = require("fs");
var https = require("https");

const { MongoClient, ObjectId } = require("mongodb");
const { UUID } = require("bson");
const MongoDBStore = require('connect-mongodb-session')(session);

/*
* Database 
*/
const MONGODB_URI = "mongodb://root:password@mongodb:27017";
var database = new MongoClient(MONGODB_URI, {
  pkFactory: { createPk: () => new UUID.toBinary() }
});
database
  .connect()
  .then(() => console.log("DB: Connected Successfully to MongoDB Instance"))
  .catch(() => console.log("DB: Connection to MongoDB Instance failed"));

/*
 * App
 */
const app = express();

//Middleware
app.use(express.json());

const corsOptions = {
  origin: "http://localhost", //(https://your-client-app.com)
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

/*
*
*  SESSION HANDLING
*
*/
const requireAuth = async (req, res, next) => {
  if(!req.body.username){
    res.status(401).send("No Session can be retrieved, if no user is given.")
  }else{
    try{
      const session = await database.db("main").collection("sessions").findOne({username: req.body.username});
      if(session === null){
        res.status(401).send("No Session found for User " + req.body.username)
      }else if (session.expires <= Date.now()){
        await database.db("main").collection("sessions").deleteOne({ username: session.username});
        res.status(401).send("Session expired");
      }else if(session.username === req.body.username){
        next();
      }
    }catch(e){
      res.status(401).send("No Session found for User " + req.body.username)
    }
  }
};

async function createSession(user){
  const collection = database.db("main").collection("sessions");
  try {
    await collection.insertOne({
      _id: user.username,
      username: user.username,
      roles: user.roles,
      expires: Date.now() + (30 * 60 * 1000)
    });
    console.log("SESSION: created new Session for User " + user.username)
  } catch (e) {
    const errno = e.message.substring(0, 6);
      switch (errno) {
        case "E11000":
          console.log("Duplicate Session E11000")
          break;
      }
  }
};

async function destroySession(username){
  try{
    database.db("main").collection("sessions").deleteOne({ username: username});
  }catch(e){
    console.log("SESSION: removed from " + username)
  }
}

/*
*
*  LOGGING
*
*/
//Log every incoming Query
app.use(function (req, res, next) {
  console.log(
    `${req.method}: ${req.ip} ${req.hostname}, ${req.protocol}, ${req.path}`
  );
  next();
});

/*
*
*  GET REQUESTS (docs/health)
*
*/
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Everything is working fine"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Everything is working fine"
  });
});

/*
*
*  API Calls
*
*/
//register
app.post("/api/register", async (req, res) => {
  const data = req.body;

  const password_valid = data.password == data.password_c;
  const data_valid = data.username.length > 1 && data.password.length > 7 && data.fullName.length > 1;

  if (data_valid && password_valid) {
    if (data.username.includes(":")) {
      res.status(400).json({
        message: "Bad Request",
        error: "invalid character in username",
        errno: 103
      });
    }
    //get the accounts collection of the mongodb database
    const collection = database.db("main").collection("accounts");
    //hash password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(data.password, salt);
    //insert new account into collection
    try {
      const result = await collection.insertOne({
        _id: data.username,
        username: data.username,
        password: hash,
        fullName: data.fullName,
        role: ["user"]
      });
      console.log(
        `REGISTER: New Account added to MongoDB. ID: ${result.insertedId}`
      );
      res.status(200).send(JSON.stringify({ message: "Success" }));
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
      errdsc += "Die angegebenen Daten entsprechen nicht den Richtlinien";
      errstatus = 406;
    }

    res.status(errstatus).json({
      message: "Bad Request",
      error: errdsc,
      errno: 101
    });
  }
});

//login
app.post("/api/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  //get the accounts collection of the mongodb database
  const collection = database.db("main").collection("accounts");
  //find user and compare passwords
  const user = await collection.findOne({ username: username });
  if (user === null) {
    res.status(403).json({
      message: "Bad Credentials",
      error: "wrong username or password",
      errno: 201
    });
    return;
  }
  //compare hash values
  const result = bcrypt.compareSync(password, user.password);
  if (result === true) {
    try{
      createSession(user);
    }catch(e){
      const errno = e.message.substring(0, 5);
      console.log(errno)
    }

    res.status(200).json(
      {
        message: "Success"
      }
    );
  }else{
    res.status(403).send(
      JSON.stringify({
        message: "Bad Credentials",
        error: "wrong username or password",
        errno: 201
      })
    );
  }
});

//logout
app.post("/api/logout", (req, res) => {
  // Destroy the session to log the user out
  destroySession(req.body.username)
  // Send a success response
  res.json({ message: "Logged out successfully" });
});

//test
app.post("/api/session", requireAuth,  (req, res) => {
  res.status(200).send("Session is valid.")
});

app.post("/api/profile", requireAuth, async (req, res) => {
  const user = await database.db("main").collection("accounts").findOne({username: req.body.username});
  res.status(200).send(user);
});

// Fallback-Handler für alle anderen Pfade
app.use((req, res) => {
  console.log(
    `${req.method}: ${req.ip} ${req.hostname}, ${req.protocol}, ${req.path}, status 404`
  );
  res
    .status(404)
    .json({
      message: "Path not Found",
      error: "The path requested by the client does not exist.",
      errno: 404
    });
});

var port = 8080;
var hostname = "0.0.0.0";

app.listen(port, hostname, () => {
  console.log(`Server running on port ${port}`);
});
