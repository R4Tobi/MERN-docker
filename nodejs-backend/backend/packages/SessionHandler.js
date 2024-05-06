const Logger = require("./Logger.js");
const logger = new Logger();

class SessionHandler {
  constructor(database) {
    this.database = database;
  }

  async checkSession(req, res, next) {
    var database = this.database;
    if (!req.body.username) {
      res.status(401).send("No Session can be retrieved, if no user is given.");
    } else {
      try {
        const session = await database
          .db("main")
          .collection("sessions")
          .findOne({ username: req.body.username });
        if (session === null) {
          res
            .status(401)
            .send("No Session found for User " + req.body.username);
          logger.session(`No Session found for User ${req.body.username}`);
        } else if (session.expires <= Date.now()) {
          await database
            .db("main")
            .collection("sessions")
            .deleteOne({ username: session.username });
          logger.session(`Session expired for User ${req.body.username}`);
          res.status(401).send("Session expired");
        } else if (session.username === req.body.username) {
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

  async createSession(user) {
    var database = this.database;
    const collection = database.db("main").collection("sessions");
    try {
      await collection.insertOne({
        _id: user.username,
        username: user.username,
        roles: user.roles,
        expires: Date.now() + 30 * 60 * 1000
      });
      logger.session("created new Session for User " + user.username);
    } catch (e) {
      const errno = e.message.substring(0, 6);
      switch (errno) {
        case "E11000":
          logger.info("Duplicate Session, Session gets renewed");
          this.updateSession(user.username);
          break;
      }
    }
  }

  async destroySession(username) {
    var database = this.database;
    try {
      database
        .db("main")
        .collection("sessions")
        .deleteOne({ username: username });
      logger.session(`User ${req.body.username} logged out, Session destroyed`);
    } catch (e) {
      logger.error("removing session from " + username + " failed");
    }
  }

  async updateSession(username) {
    var database = this.database;
    try {
      database
        .db("main")
        .collection("sessions")
        .updateOne(
          { username: username },
          {
            $set: {
              expires: Date.now() + 30 * 60 * 1000
            }
          }
        );
      } catch (e) {
        logger.error("Renewing session for " + username + " failed");
      }
    }
}

module.exports = SessionHandler;
