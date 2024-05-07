/**
 * Imports
 */

// Express.js framework for building web applications
var express = require("express");

// Middleware for enabling Cross-Origin Resource Sharing (CORS)
var cors = require("cors");

// Library for hashing passwords
var bcrypt = require("bcrypt");

// File system module for working with files
var fs = require("fs");

// HTTPS module for creating secure server connections
var https = require("https");

// MongoDB driver for Node.js
const { MongoClient, ObjectId } = require("mongodb");

// BSON library for working with Binary JSON (BSON) data
const { UUID } = require("bson");

/**
 * App
 */
const app = express();

// Middleware
app.use(express.json());

const corsOptions = {
  origin: "http://localhost", //(https://your-client-app.com)
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

/**
 * Logging
 */
const Logger = require("./packages/Logger.js");
const logger = new Logger(true);

// Log every incoming Query
app.use(function (req, res, next) {
  logger.query(`${req.method}: ${req.ip} ${req.hostname}, ${req.protocol}, ${req.path}`);
  next();
});

/**
 * Database
 */

// MongoDB connection URI
const MONGODB_URI = "mongodb://root:password@mongodb:27017";

// Create a new MongoClient instance
var database = new MongoClient(MONGODB_URI, {
  pkFactory: { createPk: () => new UUID.toBinary() }
});

// Connect to the MongoDB instance
database
  .connect()
  .then(() => logger.success("DB: Connected Successfully to MongoDB Instance"))
  .catch(() => logger.error("DB: Connection to MongoDB Instance failed"));

/**
 * Session Handling
 */

// Custom SessionHandler class for managing user sessions
const SessionHandler = require("./packages/SessionHandler.js");
const session = new SessionHandler(database);

// Middleware for requiring authentication on certain routes
const requireAuth = (req, res, next) => session.checkSession(req, res, next);

/**
 * GET REQUESTS (docs/health)
 */

/**
 * Route for serving static files from the "docs" folder
 * @route GET /docs/*
 * @group Documentation
 */
app.use("/api/docs/", express.static(__dirname + "/docs/"));

/**
 * Route for checking the health of the API
 * @route GET /api/health
 * @group Health
 * @returns {object} 200 - Success response with a message
 */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Everything is working fine"
  });
});

/**
 * API Calls
 */

/**
 * Route for user registration
 * @route POST /api/register
 * @group Authentication
 * @param {object} req.body - The request body containing user registration data
 * @returns {object} 200 - Success response with a message
 * @returns {object} 400 - Bad Request response with an error message
 * @returns {object} 409 - Conflict response with an error message
 */
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
    // Get the accounts collection of the MongoDB database
    const collection = database.db("main").collection("accounts");
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
      console.register(
        `New Account added to MongoDB. ID: ${result.insertedId}`
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

/**
 * Route for user login
 * @route POST /api/login
 * @group Authentication
 * @param {object} req.body - The request body containing user login data
 * @returns {object} 200 - Success response with a message
 * @returns {object} 403 - Forbidden response with an error message
 */
app.post("/api/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  // Get the accounts collection of the MongoDB database
  const collection = database.db("main").collection("accounts");
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
    try{
      session.createSession(user);
      logger.session(`User ${username} logged in`);
    }catch(e){
      const errno = e.message.substring(0, 5);
      logger.error(errno)
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

/**
 * Route for user logout
 * @route POST /api/logout
 * @group Authentication
 * @param {object} req.body - The request body containing user data
 * @returns {object} 200 - Success response with a message
 */
app.post("/api/logout", (req, res) => {
  // Destroy the session to log the user out
  session.destroySession(req.body.username);
  // Send a success response
  res.json({ message: "Logged out successfully" });
});

/**
 * Route for checking the validity of a user session
 * @route POST /api/session
 * @group Authentication
 * @param {object} req.body - The request body containing user data
 * @returns {object} 200 - Success response with a message
 */
app.post("/api/session", requireAuth,  (req, res) => {
  res.status(200).send("Session is valid.")
});

/**
 * Route for retrieving user profile information
 * @route POST /api/profile
 * @group Authentication
 * @param {object} req.body - The request body containing user data
 * @returns {object} 200 - Success response with user profile data
 */
app.post("/api/profile", requireAuth, async (req, res) => {
  const user = await database.db("main").collection("accounts").findOne({username: req.body.username});
  res.status(200).send(user);
});

/**
 * Fallback-Handler for all other paths
 */
app.use((req, res) => {
  logger.warn(
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
  logger.info(`Server running on port ${port}`);
});
