const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
        let query = {'_id':new ObjectId(id)}
        console.log(query);
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
        let query = {'_id':new ObjectId(postId)}
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
                if(user.likedPosts.find((elem)=>elem == postId)!=null){
                    return {'error':'Oeuvre already like by user'}
                }
                user.likedPosts.push(postId);
                oeuvre.likeCount+=1;
                let query3 = {'_id':postId}
                const collection3 = db.collection('Oeuvre');
                let oeuvreModif = await collection3.updateOne(query3,{$set:{likeCount:oeuvre.likeCount}})
                let userModif =await collection2.updateOne({"_id":user._id},{$set:{likedPosts:user.likedPosts}})
                return {oeuvreModif,userModif};
            }
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }

}

async function dislikePost(postId,userId){
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'_id':new ObjectId(postId)}
        const collection = db.collection('Oeuvre');
        let oeuvre = await collection.findOne(query);
        if (oeuvre==null) {
            return {'error':'Oeuvre not found'};
        }else{
            query2 = {'id':userId}
            const collection2 = db.collection('User');
            let user = await collection2.findOne(query2);
            if (user==null) {
                return {'error':'User not found'};
            }
            if(user.likedPosts.find((elem)=>elem == postId)==null){
                return {'error':'Oeuvre not like by user'}
            }
            user.likedPosts.splice(user.likedPosts.indexOf(postId),1);
            oeuvre.likeCount-=1;
            let oeuvreModif = await collection.updateOne(query,{$set:{likeCount:oeuvre.likeCount}})
            let userModif = await collection2.updateOne({"_id":user._id},{$set:{likedPosts:user.likedPosts}})
            return {oeuvreModif,userModif};
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }
}

async function addOeuvre(title, description, author, category, subCategory, illustration, video,postDate,releaseDate, isMediaTypeImages,toSell,price,linkToBuy,canTchat){
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
            likeCount: 0,
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

async function updateOeuvre(id,title, description, author, category, subCategory, illustration, video,postDate,releaseDate, isMediaTypeImages, likeCount,toSell,price,linkToBuy,canTchat){
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'_id':new ObjectId(id)}
        const collection = db.collection('Oeuvre');
        let oeuvre = await collection.findOne(query);
        if (oeuvre==null) {
            return {'error':'Oeuvre not found'};
        }else{
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
                author :author,
                toSell: toSell,
                price: price,
                linkToBuy: linkToBuy,
                canTchat: canTchat,
            };
            let result = await collection.updateOne(query,{$set:newOeuvre})
            return result;
        }
    }
    catch (err) {
        console.log(err)
        throw err;
    }
    finally{
        if(client) client.close();
    }
}

async function deleteOeuvre(id){
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'_id':new ObjectId(id)}
        const collection = db.collection('Oeuvre');
        let oeuvre = await collection.findOne(query);
        if (oeuvre==null) {
            return {'error':'Oeuvre not found'};
        }else{
            let result = await collection.deleteOne(query)
            return result;
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
    getAllIdOeuvre,
    getCatOeuvre,
    getAuthorOeuvre,
    likePost,
    dislikePost,
    addOeuvre,
    updateOeuvre,
    deleteOeuvre
}