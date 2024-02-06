const { MongoClient, ServerApiVersion } = require('mongodb');
const minio = require('./minio');

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
        console.log(user);
        if(user == null) {
            return { error: 'User not found' };
        }else {
            if (user.password !== password) {
                return { error: 'Password does not match' };
            } else {
                user.image = await minio.getFile(`/user/${user.id}/${user.image}`)
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

async function createUser(id, mail, password, firstName, lastName, birthdate, address, file, favoritCat) {
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
                    favoritCat: favoritCat,
                    image: file.originalname,
                    permission: 'user',
                    folowing: [],
                    folowers: [],
                    gallery: [],
                    lists:[
                        {
                            listName: 'Favorites',
                            listImage: '',
                            listDescription: 'User\'s favorites posts',
                            arts:[]
                        }
                    ],
                    likedPosts:[]
                };
                const result = await collection.insertOne(newUser);
                minio.uploadFile(`/user/${id}/${file.originalname}`,file)
                return result;
            }
        }
    } catch (err) {
        return err;
    } finally {
        if (client) client.close();
    }
}

async function updateUser(id, mail, password, firstName, lastName, birthdate, address, image,permission) {
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

async function getUserFolowers(userId){
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
        return user.folowers;
    }catch(e){
        console.log(e);
        return {error: "An error occured"};
    }finally{
        if(client) client.close();
    }
}
async function getUserFolowing(userId){
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
        return user.folowing;
    }catch(e){
        console.log(e);
        return {error: "An error occured"};
    }finally{
        if(client) client.close();
    }
}
async function followArtist(userId,artistId){
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
        query = {id: artistId};
        let artist = await collection.findOne(query);
        if(artist.error){
            return {error: "Artist not found"};
        }
        if(user.folowing.includes(artistId)){
            return {error: "Already following"};
        }
        //Ajout de l'ami
        user.folowing.push(artistId);
        artist.folowers.push(userId);
        //Mise à jour des utilisateurs
        query = {id: userId};
        const updateResultUser = await collection.updateOne(query,{$set:{folowing : user.folowing}});
        query = {id: artistId};
        const updateResultArtist = await collection.updateOne(query,{$set:{folowers : artist.folowers}});
        return {updateResultUser,updateResultArtist};
    }catch(e){
        console.log(e);
        return {error: "An error occured"};
    }finally{
        if(client) client.close();
    }
}

async function unfollowArtist(userId,artistId){
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
        query = {id: artistId};
        let artist = await collection.findOne(query);
        if(artist.error){
            return {error: "Artist not found"};
        }
        if(!user.folowing.includes(artistId)){
            return {error: "Not following"};
        }
        //Ajout de l'ami
        user.folowing.splice(user.folowing.indexOf(artistId),1);
        artist.folowers.splice(artist.folowers.indexOf(userId),1);
        //Mise à jour des utilisateurs
        query = {id: userId};
        const updateResultUser = await collection.updateOne(query,{$set:{folowing : user.folowing}});
        query = {id: artistId};
        const updateResultArtist = await collection.updateOne(query,{$set:{folowers : artist.folowers}});
        return {updateResultUser,updateResultArtist};
    }catch(e){
        console.log(e);
        return {error: "An error occured"};
    }finally{
        if(client) client.close();
    }
}

async function getUser(id){
    try{
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('User');
        let query = {id: id};
        let user = await collection.findOne(query);
        if(user==null){
            return {error: 'User not found'};
        }else{
            user.image = await minio.getFile(`/user/${user.id}/${user.image}`)
            let nonConfientialInfo = {
                id: user.id,
                folowing: user.folowing,
                gallery: user.gallery,
                likedPosts: user.likedPosts,
                favoritCat: user.favoritCat,
                image: user.image
            };
            return nonConfientialInfo;
        }
    }catch(e){
        console.log(e);
        return {error: "An error occured"};
    }finally{
        if(client) client.close();
    }
}

async function getUsersId(){
    try{
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('User');
        let users = await collection.find({},{projection:{id:1}}).toArray();
        let ids= users.map((elem)=>elem.id)
        return ids;
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
    getUserFolowers,
    getUserFolowing,
    followArtist,
    unfollowArtist,
    getUser,
    getUsersId,
};
