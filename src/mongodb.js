const { MongoClient, ServerApiVersion } = require("mongodb");

// const url = process.env.MONGODBURL ||  "mongodb://mongodb.ahddry.fr:27017/";
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
        if (user==null) {
            return {'error':'User not found'};
        }else{
            if (user.password !== password) {
                return {'error':'Password does not match'};
            }else{
                return user;
            }
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }
}

async function createUser(mail, password, firstName, lastName) {
    try {
        await client.connect()
        const db = client.db(bdd)
        const collection = db.collection('User')
        let query = {'mail': mail}
        const user = await collection.findOne(query)
        if (user!=null) {
            return {'error':'User already exists'}
        }else{
            const newUser = {
                mail: mail,
                password: password,
                firstName: firstName,
                lastName: lastName,
                permission: 'user'
            }
            console.log(newUser)
            const result = await collection.insertOne(newUser);
            return result;
        }
    } catch (err) {
        return err;
    } finally {
        if (client) client.close();
    }
}

async function updateUser(mail,password,firstName,lastName,permission){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('User');
        let query = {'mail': mail}
        const user = await collection.findOne(query);
        if (user==null) {
            return {'error':'User not found'};
        }else{
            const newUser = {
                mail: mail,
                password: password,
                firstName: firstName,
                lastName: lastName,
                permission: permission
            }
            const result = await collection.updateOne(query,{$set: newUser});
            return result;
        }
    } catch (err) {
        return err;
    } finally {
        if (client) client.close();
    }

}
async function deleteUser(mail,password){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('User');
        let query = {'mail': mail}
        const user = await collection.findOne(query);
        if (user==null) {
            return {'error':'User not found'};
        }else if(user.password==password){
            const result = await collection.deleteOne(query);
            return result;
        }else{
            return {'error':'Bad password'}
        }
    } catch (err) {
        return err;
    } finally {
        if (client) client.close();
    }


}

module.exports = {
    checkConnection,
    checkUser,
    createUser,
    updateUser,
    deleteUser,
}