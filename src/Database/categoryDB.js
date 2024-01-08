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

async function getCategory(){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('Art');
        let category = await collection.find().toArray()
        if (category==null) {
            return {'error':'Category not found'};
        }else{
            return category;
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }
}

module.exports = {
    getCategory
}