var express = require("express");
var path = require("path");
const { MongoClient } = require("mongodb");

const bodyParser = require('body-parser'); // Middleware

var client = new MongoClient("mongodb://root:password@localhost:27017");

app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
  console.log(`${req.method}: ${req.ip} ${req.hostname}, ${req.protocol}, ${req.path}`);
  next();
});

app.get("/health", (req, res) => {
  res.send("{ success: true, message: \"Everything is working fine\"}");
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
});

app.post("/test", (req, res) => {
  // Connect to database
  client
    .connect()
    .then(() => console.log("Connected Successfully"))
    .catch((error) => console.log("Failed to connect", error));
})

var port = 8080;
var hostname = "0.0.0.0";

app.listen(port, hostname, () => {
  console.log(`Server running on port ${port}`);
});
