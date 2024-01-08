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

async function getIdOeuvre(id){
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'_id':parseInt(id)}
        const collection = db.collection('Oeuvre');
        let oeuvre = await collection.findOne(query);
        if (oeuvre==null) {
            return {'error':'Oeuvre not found'};
        }else{
            return oeuvre;
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }
}

async function getAllOeuvre(){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('Oeuvre');
        let oeuvre = await collection.find().toArray()
        if (oeuvre==null) {
            return {'error':'Oeuvre not found'};
        }else{
            return oeuvre;
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }
}

async function getCatOeuvre(category,subCategory){
    try {
        await client.connect();
        const db = client.db(bdd);
        let query;
        if(subCategory==="all"){
            query = {'category':category}
        } else{
            query = {'category':category,'subCategory':subCategory}
        }
        const collection = db.collection('Oeuvre');
        let oeuvre = await collection.find(query).toArray()
        if (oeuvre==null) {
            return {'error':'Oeuvre not found'};
        }else{
            return oeuvre;
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }

}


module.exports = {
    getIdOeuvre,
    getAllOeuvre,
    getCatOeuvre
}