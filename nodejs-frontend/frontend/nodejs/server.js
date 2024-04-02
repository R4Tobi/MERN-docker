var express = require("express");
var path = require("path");
var serveStatic = require("serve-static");

app = express();
app.use(serveStatic(__dirname + "/public"));

app.get("/health", (req, res) => {
  res.end("server is running!");
})

var port = 80;
var hostname = "0.0.0.0";

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});