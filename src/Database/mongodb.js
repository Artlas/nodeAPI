const { MongoClient, ServerApiVersion } = require("mongodb");

const url = process.env.MONGODBURL ||  "mongodb://localhost:27017/";
const bdd = 'Artlas'

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function checkConnection() {
    try {
        await client.connect();
        await client.db('admin').command({ping:1});
        return true;
    } catch (err) {
        throw err;
    } finally {
        if (client) client.close()
    }
}




module.exports = {
    checkConnection,
}