const { MongoClient, ServerApiVersion } = require("mongodb");

const url = "mongodb://localhost:27017";

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

module.exports = client