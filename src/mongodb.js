const { MongoClient, ServerApiVersion } = require("mongodb");

const url = process.env.MONGODBURL ||  "mongodb://mongodb.ahddry.fr:27017/";

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function query(query) {
    try {
        await client.connect();
        const rows = await client.db('admin').command({ping:1});
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (client) client.close();
    }
}

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
    query,
    checkConnection,
}