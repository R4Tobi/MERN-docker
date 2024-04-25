/* 
* Imports
*/
var express = require("express");
const session = require("express-session");
var cors = require("cors");
var bcrypt = require("bcrypt")

const { MongoClient, ObjectId } = require("mongodb");
const { UUID } = require("bson");

/*
* Database 
*/
var database = new MongoClient("mongodb://root:password@mongodb:27017", {
  pkFactory: { createPk: () => new UUID.toBinary() }
});
database
  .connect()
  .then(() => console.log("DB: Connected Successfully to MongoDB Instance"))
  .catch(() => console.log("DB: Connection to MongoDB Instance failed"))

/*
* App
*/
app = express();

//Middleware
app.use(express.json());

const corsOptions = {
  origin: "http://localhost/", //(https://your-client-app.com)
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 60 minutes
  })
);

//Log every incoming Query
app.use(function (req, res, next) {
  console.log(`${req.method}: ${req.ip} ${req.hostname}, ${req.protocol}, ${req.path}`);
  next();
});

//HealthCheck Docker
app.get("/health", (req, res) => {
  res.json(
    { 
      success: true, 
      message: "Everything is working fine" 
    }
  );
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Everything is working fine"
  });
});

/*
* API Calls
*/
//register
app.post("/api/register", async (req, res) => {
  const data = req.body;
  if (data.username && data.password && data.name) {
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
        fullName: data.name,
        role : ["user"]
      });
      console.log(
        `REGISTER: New Account added to MongoDB. ID: ${result.insertedId}`
      );
      res.status(200).send(JSON.stringify({ message: "Success" }));
    } catch (e) {
      const errno = e.message.substring(0, 5);
      switch (errno) {
        case "E1100":
          res.status(400).json({
            message: "Bad Request",
            error: "username is already used",
            errno: 102
          });
          break;
      }
    }
  } else {
    res.status(400).json({
      message: "Bad Request",
      error: "missing data for registration",
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
  if (user === null){
    res.status(403).json(
      {
        message: "Bad Credentials",
        error: "wrong username or password",
        errno: 201
      }
    );
    return;
  }
  //compare hash values
  const result = bcrypt.compareSync(password, user.password);
  if (result == true) {
    req.session.userId = btoa(user._id + ":" + Date.now());
    res.cookie("authenticated", true, {
      maxAge: 1,
      httpOnly: true
    });
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
  req.session.destroy();
  // Send a success response
  res.json({ message: "Logged out successfully" });
});

//test
app.post("/test", (req, res) => {
  if(req.session.userId){
    const user = atob(req.session.userId).split(":");
    res.status(200).json({
      message: "Authorized",
      user: user[0],
      timestamp: user[1],
      data: []
    });
  }else{
    res.status(401).json(
      {
        message: "Unauthorized",
        error: "Session Expired or Invalid",
        errno: 301
      }
    );
  }
})

// Fallback-Handler für alle anderen Pfade
app.use((req, res) => {
  console.log(`${req.method}: ${req.ip} ${req.hostname}, ${req.protocol}, ${req.path}, status 404`);
  res.status(404).json({message: "Path not Found", error: "The path requested by the client does not exist.", errno: 404});
});

var port = 8080;
var hostname = "0.0.0.0";

app.listen(port, hostname, () => {
  console.log(`Server running on port ${port}`);
});
