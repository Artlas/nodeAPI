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

async function checkUser(email, id, password) {
    try {
        await client.connect();
        const db = client.db(bdd);
        let query
        if(id!=null){
            query = {'id':id}
        }else{
            query = {'mail': email}
        }
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

async function createUser(id, mail, password, firstName, lastName, birthdate, address) {
    try {
        await client.connect()
        const db = client.db(bdd)
        const collection = db.collection('User')
        let query = {'mail': mail}
        let user = await collection.findOne(query)
        if (user!=null) {
            return {'error':'mail already used'}
        }else{
            query = {'id': id}
            user = await collection.findOne(query)
            if (user!=null) {
                return {'error':'mail already used'}
            }else{
                const newUser = {
                    id: id,
                    mail: mail,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    birthdate: birthdate,
                    address: address,
                    permission: 'user'
                }
                console.log(newUser)
                const result = await collection.insertOne(newUser);
                return result;
            }
        }
    } catch (err) {
        return err;
    } finally {
        if (client) client.close();
    }
}

async function updateUser(id,mail,password,firstName,lastName,birthdate,address,permission){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('User');
        let query = {'id':id,'mail': mail}
        const user = await collection.findOne(query);
        if (user==null) {
            return {'error':'User not found'};
        }else{
            const newUser = {
                id: id,
                mail: mail,
                password: password,
                firstName: firstName,
                lastName: lastName,
                birthdate: birthdate,
                address: address,
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

async function updatePassword(mail, password, newPassword){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('User');
        let query = {'mail': mail}
        const user = await collection.findOne(query);
        if (user==null) {
            return {'error':'User not found'};
        }else{
            if (user.password !== password) {
                return {'error':'Password does not match'};
            }else{
                const newUser = {
                    id: user.id,
                    mail: mail,
                    password: newPassword,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    birthdate: user.birthdate,
                    address: user.address,
                    permission: user.permission
                }
                const result = await collection.updateOne(query,{$set: newUser});
                return result;
            }
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
    checkUser,
    createUser,
    updateUser,
    deleteUser,
}