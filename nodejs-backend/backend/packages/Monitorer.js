class Monitorer {
    constructor(mongoClient, db, collection) {
        this.db = mongoClient.db(db).collection(collection);
    }

    query(ip) {
        this.db.updateOne({ _id: ip }, { $inc: { counter: 1 } }, { upsert: true });
    }
}

module.exports = Monitorer;