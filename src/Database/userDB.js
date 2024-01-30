const { MongoClient, ServerApiVersion } = require('mongodb');

const url = process.env.MONGODBURL || 'mongodb://localhost:27017/';
const bdd = 'Artlas';

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function checkUser(email, id, password) {
    try {
        await client.connect();
        const db = client.db(bdd);
        let query;
        if (id != null) {
            query = { id: id };
        } else {
            query = { mail: email };
        }
        const collection = db.collection('User');
        let user = await collection.findOne(query);
        if (user == null) {
            return { error: 'User not found' };
        } else {
            if (user.password !== password) {
                return { error: 'Password does not match' };
            } else {
                return user;
            }
        }
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (client) client.close();
    }
}
async function checkUserExists(email, id) {
    try {
        await client.connect();
        const db = client.db(bdd);
        let query;
        if (id != null) {
            query = { id: id };
        } else {
            query = { mail: email };
        }
        const collection = db.collection('User');
        let user = await collection.findOne(query);
        return { userExists: user != null };
    } catch (err) {
        console.log(err);
        return { userExists: false, error: 'An error occurred', details: err };
    } finally {
        await client.close();
    }
}

async function createUser(id, mail, password, firstName, lastName, birthdate, address) {
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('User');
        let query = { mail: mail };
        let user = await collection.findOne(query);
        if (user != null) {
            return { error: 'mail already used' };
        } else {
            query = { id: id };
            user = await collection.findOne(query);
            if (user != null) {
                return { error: 'mail already used' };
            } else {
                const newUser = {
                    id: id,
                    mail: mail,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    birthdate: birthdate,
                    address: address,
                    permission: 'user',
                    friends: [],
                };
                console.log(newUser);
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

async function updateUser(id, mail, password, firstName, lastName, birthdate, address, permission) {
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('User');
        let query = { id: id, mail: mail };
        const user = await collection.findOne(query);
        if (user == null) {
            return { error: 'User not found' };
        } else {
            const newUser = {
                id: id,
                mail: mail,
                password: password,
                firstName: firstName,
                lastName: lastName,
                birthdate: birthdate,
                address: address,
                permission: permission,
            };
            const result = await collection.updateOne(query, { $set: newUser });
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
        let query = { mail: mail };
        const user = await collection.findOne(query);
        if (user == null) {
            return { error: 'User not found' };
        } else if (user.password == password) {
            const result = await collection.deleteOne(query);
            return result;
        } else {
            return { error: 'Bad password' };
        }
    } catch (err) {
        return err;
    } finally {
        if (client) client.close();
    }
}

async function addFriends(userId, friendsId){
    try{
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('User');
        let query = {id: userId};
        //Vérification que l'utilisateur existe et n'est pas déjà ami avec le ou les utilisateurs demandés
        let user = await collection.findOne(query);
        if(user.error){
            return {error: "User not found"};
        }
        query = {id: friendsId};
        let friend = await collection.findOne(query);
        if(friend.error){
            return {error: "Friend not found"};
        }
        if(user.friends.includes(friendsId)){
            return {error: "Already friends"};
        }
        //Ajout de l'ami
        user.friends.push(friendsId);
        friend.friends.push(userId);
        //Mise à jour des utilisateurs
        query = {id: userId};
        const updateResultUser = await collection.updateOne(query,{$set:{friends : user.friends}});
        query = {id: friendsId};
        const updateResultFriend = await collection.updateOne(query,{$set:{friends : friend.friends}});
        return {updateResultUser,updateResultFriend};
    }catch(e){
        console.log(e);
        return {error: "An error occured"};
    }finally{
        if(client) client.close();
    }
}

async function getUserFriends(userId){
    try{
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('User');
        let query = {id: userId};
        //Vérification que l'utilisateur existe
        let user = await collection.findOne(query);
        if(user.error){
            return {error: "User not found"};
        }
        return user.friends;
    }catch(e){
        console.log(e);
        return {error: "An error occured"};
    }finally{
        if(client) client.close();
    }
}

module.exports = {
    checkUser,
    createUser,
    updateUser,
    deleteUser,
    checkUserExists,
    updatePassword,
    addFriends,
    getUserFriends,
};
