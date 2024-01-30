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

async function getAuthorOeuvre(author){
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'author':author}
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

async function getAllIdOeuvre(){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('Oeuvre');
        let oeuvre = await collection.find().toArray()
        if (oeuvre==null) {
            return {'error':'Oeuvre not found'};
        }else{
            return oeuvre.map((oeuvre)=>oeuvre._id);
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

async function likePost(postId,userId){
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'_id':parseInt(postId)}
        const collection = db.collection('Oeuvre');
        let oeuvre = await collection.findOne(query);
        if (oeuvre==null) {
            return {'error':'Oeuvre not found'};
        }else{
            query = {'id':userId}
            const collection2 = db.collection('User');
            let user = await collection2.findOne(query);
            if (user==null) {
                return {'error':'User not found'};
            }else{
                let query3 = {'_id':parseInt(postId)}
                const collection3 = db.collection('Oeuvre');
                let userLike = oeuvre.likes.find((element) => element == userId);
                if(userLike!=null){
                    return {'error':'Oeuvre already like by user'}
                }
                oeuvre.likes.push(userId);
                let oeuvre2 = await collection3.updateOne(query3,{$set:{likes:oeuvre.likes}})
                return oeuvre2;
            }
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }

}

async function addOeuvre(title, description, author, category, subCategory, illustration, video,postDate,releaseDate, isMediaTypeImages, likeCount,toSell,price,linkToBuy,canTchat){
    try {
        await client.connect();
        const db = client.db(bdd);
        let newOeuvre = {
            title: title,
            description: description,
            category: category,
            subCategory: subCategory,
            illustration: illustration,
            video: video,
            postDate:postDate ,
            releaseDate: releaseDate,
            isMediaTypeImages: isMediaTypeImages,
            author: author,
            likeCount: likeCount,
            toSell: toSell,
            price: price,
            linkToBuy: linkToBuy,
            canTchat: canTchat,
        };
        const collection2 = db.collection('Art');
        let query = {'name':category}
        let artCat=await  collection2.findOne(query)
        if(artCat==null){
            return {'error':'Category not found'};
        }
        query = {'name':category,'subcategories':{$elemMatch:{'name':subCategory}}};
        let artSubCat=await  collection2.findOne(query)
        if(artSubCat==null){
            return {'error':'SubCategory not found'};
        }
        const collection = db.collection('Oeuvre');
        let result = await collection.insertOne(newOeuvre);
        return result;
    } catch (err) {
        console.log(err)
        throw err;
    }finally{
        if(client) client.close();
    }
}


module.exports = {
    getIdOeuvre,
    getAllOeuvre,
    getAllIdOeuvre,
    getCatOeuvre,
    getAuthorOeuvre,
    likePost,
    addOeuvre
}