class ToDo {
    constructor(mongoClient) {
        this.database = mongoClient.db("main").collection("todos");
    }
}