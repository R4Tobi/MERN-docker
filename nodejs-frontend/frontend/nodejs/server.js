var express = require("express");
var path = require("path");
var serveStatic = require("serve-static");

app = express();

app.use(function (req, res, next) {
  console.log(`${req.method}: ${req.ip} ${req.hostname}, ${req.protocol}, ${req.path}`);
  next();
});

app.get("/health", (req, res) => {
  res.end("server is running!");
});

app.use(serveStatic(__dirname + "/public"));

var port = 80;
var hostname = "0.0.0.0";

app.listen(port, hostname, () => {
  console.log(`Server running on port ${port}`);
});