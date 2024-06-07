class ToDo {
  constructor(mongoClient) {
    this.database = mongoClient.db("main").collection("todos");
  }

  add(username, todo, todoID) {
    this.database.insertOne({
      todoID : todoID,
      username: username,
      todo: todo,
    });
  }

  get(username) {
    return this.database.find({ username: username }).toArray();
  }
}

export default ToDo;