/* 
* Imports
*/
var express = require("express");
var path = require("path");

const { MongoClient } = require("mongodb");
const { UUID } = require("bson");

const bodyParser = require('body-parser'); // Middleware

/*
* Database 
*/
var database = new MongoClient("mongodb://dbadmin:password@mongodb:27017", {
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
app.use(bodyParser.json());

//Log every incoming Query
app.use(function (req, res, next) {
  console.log(`${req.method}: ${req.ip} ${req.hostname}, ${req.protocol}, ${req.path}`);
  next();
});

//HealthCheck Docker
app.get("/health", (req, res) => {
  res.send("{ success: true, message: \"Everything is working fine\"}");
});

/*
* API Calls
*/
app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
});

app.post("/register", async (req, res) => {
  const data = req.body;
  if(data.username && data.password && data.name){
    //get the accounts collection of the mongodb database
    const collection = database.db("main").collection("accounts");
    //insert new account into collection
    try{
      const result = await collection.insertOne({
        _id: data.username,
        username: data.username,
        password: data.password,
        fullName: data.name
      });
      console.log(
        `REGISTER: New Account added to MongoDB. ID: ${result.insertedId}`
      );
      res.status(200).send(JSON.stringify({ message: "Success" }));
    }catch (e) {
      const errno = e.message.substring(0,5);
      switch(errno){
        case "E1100":
            res
              .status(400)
              .send(
                JSON.stringify({
                  message: "Bad Request",
                  error: "username is already used",
                  errno: 102
                })
              );
          break;
      }
    }
  }else{
    res
      .status(400)
      .send(
        JSON.stringify({
          message: "Bad Request",
          error: "missing data for registration",
          errno: 101
        })
      );
  }
})

app.post("/test", (req, res) => {


})

var port = 8080;
var hostname = "0.0.0.0";

app.listen(port, hostname, () => {
  console.log(`Server running on port ${port}`);
});
