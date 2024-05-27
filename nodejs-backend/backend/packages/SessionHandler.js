/**
 * Represents a session handler for managing user sessions.
 */
import Logger from "./Logger.js";
const logger = new Logger();

class SessionHandler {
  /**
   * Creates a new instance of the SessionHandler class.
   * @param {Object} database - The database object.
   */
  constructor(database) {
    this.database = database;
  }

  /**
   * Checks if the session is valid and authenticated.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async checkSession(req, res, next) {
    var database = this.database;
    if (!req.body.sessionID) {
      res.status(401).send("No Session can be retrieved, if no sessionID is given.");
    } else {
      try {
        const session = await database
          .db("main")
          .collection("sessions")
          .findOne({ _id: req.body.sessionID });
        if (session === null) {
          res
            .status(401)
            .send("No Session found for User " + req.body.username);
          logger.session(`No Session found for User ${req.body.username}`);
        } else if (session.expires <= Date.now()) {
          await database
            .db("main")
            .collection("sessions")
            .deleteOne({ _id: req.body.sessionID });
          logger.session(`Session expired for User ${req.body.username}`);
          res.status(401).send("Session expired");
        } else if (session._id === req.body.sessionID && atob(req.body.sessionID).split("::::")[0] === req.headers["x-real-ip"]) {
          logger.session(`User ${req.body.username} is authenticated, Session is renewed`);
          this.updateSession(req.body.username);
          next();
        }
      } catch (e) {
        logger.session(`No Session found for User ${req.body.username}`);
        res.status(401).send("No Session found for User " + req.body.username);
      }
    }
  }

  async checkAdmin(req, res, next) {
    var database = this.database;
    if (!req.body.sessionID) {
      res.status(401).send("No Session can be retrieved, if no sessionID is given.");
    } else {
      try {
        const session = await database
          .db("main")
          .collection("sessions")
          .findOne({ _id: req.body.sessionID });
        if (session === null) {
          res
            .status(401)
            .send("No Session found for User " + req.body.username);
          logger.session(`No Session found for User ${req.body.username}`);
        } else if (session.expires <= Date.now()) {
          await database
            .db("main")
            .collection("sessions")
            .deleteOne({ _id: req.body.sessionID });
          logger.session(`Session expired for User ${req.body.username}`);
          res.status(401).send("Session expired");
        } else if (session._id === req.body.sessionID && atob(req.body.sessionID).split("::::")[0] === req.headers["x-real-ip"]) {
          logger.session(`User ${req.body.username} is authenticated, Session is renewed`);
          this.updateSession(req.body.username);
          if (session.roles.includes("admin")) {
            next();
          }else{
            res.status(403).send("User is not authorized to access this resource");
          }
        }
      } catch (e) {
        logger.session(`No Session found for User ${req.body.username}`);
        res.status(401).send("No Session found for User " + req.body.username);
      }
    }
  }

  /**
   * Creates a new session for the user.
   * @param {Object} user - The user object.
   * @param {string} sessionID - The session ID.
   */
  async createSession(user, sessionID) {
    var database = this.database;
    const collection = database.db("main").collection("sessions");
    try {
      await collection.insertOne({
        _id: sessionID,
        username: user.username,
        roles: user.role,
        createdISO: new Date.now().toISOString(),
        expiresISO: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        created: Date.now(),
        expires: Date.now() + 30 * 60 * 1000
      });
      logger.session("created new Session for User " + user.username);
    } catch (e) {
      const errno = e.message.substring(0, 6);
      switch (errno) {
        case "E11000":
          logger.info("Duplicate Session, Session gets renewed" + new Date(Date.now() + 30 * 60 * 1000).toISOString());
          this.updateSession(sessionID);
          break;
      }
    }
  }

  /**
   * Destroys the session.
   * @param {string} sessionID - The session ID.
   */
  async destroySession(sessionID) {
    var database = this.database;
    try {
      database
        .db("main")
        .collection("sessions")
        .deleteOne({ _id: sessionID });
      logger.session(`User ${username} logged out, Session destroyed`);
    } catch (e) {
      logger.error("removing session from " + atob(sessionID.split("::::")[2]) + " failed with " + e);
    }
  }

  /**
   * Updates the session expiration time.
   * @param {string} sessionID - The session ID.
   */
  async updateSession(sessionID) {
    var database = this.database;
    try {
      database
        .db("main")
        .collection("sessions")
        .updateOne(
          { _id: sessionID },
          {
            $set: {
              expiresISO: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
              expires: Date.now() + 30 * 60 * 1000
            }
          }
        );
      } catch (e) {
        logger.error("Renewing session for " + atob(sessionID.split("::::")[2]) + " failed with " + e);
      }
    }
}

export default SessionHandler;
