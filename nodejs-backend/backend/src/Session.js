class Session {
    constructor(user, createdAt) {
        this.user = user;
        this.createdAt = createdAt;
    }

async function requireAuth (req, res, next) => {
  if(!req.body.username){
    res.status(401).send("No Session can be retrieved, if no user is given.")
  }else{
    try{
      const session = await database.db("main").collection("sessions").findOne({username: req.body.username});
      if(session === null){
        res.status(401).send("No Session found for User " + req.body.username)
      }else if (session.expires <= Date.now()){
        await database.db("main").collection("sessions").deleteOne({ username: session.username});
        res.status(401).send("Session expired");
      }else if(session.username === req.body.username){
        next();
      }
    }catch(e){
      res.status(401).send("No Session found for User " + req.body.username)
    }
  }
};

async function createSession(user){
  const collection = database.db("main").collection("sessions");
  try {
    await collection.insertOne({
      _id: user.username,
      username: user.username,
      roles: user.roles,
      expires: Date.now() + (30 * 60 * 1000)
    });
    console.log("SESSION: created new Session for User " + user.username)
  } catch (e) {
    const errno = e.message.substring(0, 6);
      switch (errno) {
        case "E11000":
          console.log("Duplicate Session E11000")
          break;
      }
  }
};

async function destroySession(username){
  try{
    database.db("main").collection("sessions").deleteOne({ username: username});
  }catch(e){
    console.log("SESSION: removed from " + username)
  }
}
}

module.exports = Session;