const express = require('express');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const fs = require("fs");

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
    console.log("checking and building config file");
    if (fs.existsSync(".env")) {
        console.log("config file found. validating config");
        if (process.env.MONGODB_HOST && process.env.MONGODB_PORT && process.env.MONGODB_USER && process.env.MONGODB_PASS) {
            console.log("config file valid. starting server");
            const config = {
                port: process.env.PORT || 8080,
                database: {
                    host: process.env.MONGODB_HOST,
                    port: process.env.MONGODB_PORT,
                    username: process.env.MONGODB_USER,
                    password: process.env.MONGODB_PASS,
                    database: process.env.MONGODB_DB || "main"
                }
            };
            fs.writeFileSync("./config.json", JSON.stringify(config));
        } else {
            console.log("config file invalid. please provide a valid .env file as mentioned in the documentation");
        }
    }else{
        console.log(
        "config file not found, please provide a .env file as mentioned in the documentation"
        );
    }
});

/*
* MIDDLEWARE
*/
app.use(express.json());

/*
* Authentication and Authorization
*/

//register
app.post("/register", (req, res, next) => new User().register(req, res, next), (req, res) => {
    //if next is called there went something wrong
    req.statusCode(501).send("Something went wrong");
});

//login
app.post("/login", (req, res, next) => new User().login(req, res, next), (req, res) => {
    //if next is called there went something wrong
    req.statusCode(501).send("Something went wrong");
});