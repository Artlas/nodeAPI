const { MongoClient, ServerApiVersion } = require("mongodb");

//const url = process.env.MONGODBURL ||  "mongodb://mongodb.ahddry.fr:27017/";
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


async function checkUser(email, password) {
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'mail': email}
        const collection = db.collection('User');
        let user = await collection.findOne(query)
        if (user.length==0) {
            return {'error':'User not found'};
        }
        if (user.password !== password) {
            return {'error':'Password does not match'};
        }
        return true;
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }
}


async function getTokenForUser(email) {
    function generateToken() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let token = '';
        for (let i = 0; i < 32; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'mail': email}
        const collection = db.collection('User');
        const user = await collection.find(query);
        if (!user) {
            return {'error':'User not found'};
        }
        if (user.token) {
            return user.token;
        }
        const token = generateToken();
        const expireTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
        let val = await collection.updateOne({ query }, { $set: { 'token' :{token, expireTime} } });
        console.log(val)
        return token;
    } catch (err) {
        throw err;
    } finally {
        if (client) client.close();
    }
}


module.exports = {
    checkConnection,
    checkUser,
    getTokenForUser
}