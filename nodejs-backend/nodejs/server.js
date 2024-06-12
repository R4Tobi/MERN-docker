const express = require('express');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

/* 
* import custom packages
*/
const User = require('./packages/User.js');

const app = express();

// Set up Global configuration access
dotenv.config();

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/*
* MIDDLEWARE
*/
app.use(express.json());

/*
* Authentication and Authorization
*/

//register
app.post("/register", new User().register(req, res, next), (req, res) => {
    //if next is called there went something wrong
    req.statusCode(501).send("Something went wrong");
});

//login
app.post("/login", new User().login(req, res, next), (req, res) => {
    //if next is called there went something wrong
    req.statusCode(501).send("Something went wrong");
});