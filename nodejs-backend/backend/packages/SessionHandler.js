const Logger = require("./Logger.js");
const logger = new Logger();

class SessionHandler {
  constructor(database) {
    this.database = database;
  }

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

  async createSession(user, sessionID) {
    var database = this.database;
    const collection = database.db("main").collection("sessions");
    try {
      await collection.insertOne({
        _id: sessionID,
        username: user.username,
        roles: user.role,
        expires: Date.now() + 30 * 60 * 1000
      });
      logger.session("created new Session for User " + user.username);
    } catch (e) {
      const errno = e.message.substring(0, 6);
      switch (errno) {
        case "E11000":
          logger.info("Duplicate Session, Session gets renewed");
          this.updateSession(sessionID);
          break;
      }
    }
  }

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
              expires: Date.now() + 30 * 60 * 1000
            }
          }
        );
      } catch (e) {
        logger.error("Renewing session for " + atob(sessionID.split("::::")[2]) + " failed with " + e);
      }
    }
}

module.exports = SessionHandler;
