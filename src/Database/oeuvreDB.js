const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const minio = require('./minio');

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
        const collection = db.collection('Oeuvre');
        let oeuvre = await collection.findOne(query);
        if (oeuvre==null) {
            return {'error':'Oeuvre not found'};
        }else{
            if(oeuvre.isMediaTypeImages){
                names = oeuvre.illustration
                oeuvre.illustration = []
                for(let j=0;j<names.length;j++){
                    oeuvre.illustration.push(await minio.getFile(`/oeuvre/${oeuvre.author}/${oeuvre._id}/${names[j]}`))
                }
            }
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
            for (let i=0 ;i<oeuvre.length;i++){
                if(oeuvre[i].isMediaTypeImages){
                    names = oeuvre[i].illustration
                    oeuvre[i].illustration = []
                    for(let j=0;j<names.length;j++){
                        oeuvre[i].illustration.push(await minio.getFile(`/oeuvre/${oeuvre[i].author}/${oeuvre[i]._id}/${names[j]}`))
                    }
                }
            }
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
            for (let i=0 ;i<oeuvre.length;i++){
                if(oeuvre[i].isMediaTypeImages){
                    names = oeuvre[i].illustration
                    oeuvre[i].illustration = []
                    for(let j=0;j<names.length;j++){
                        oeuvre[i].illustration.push(await minio.getFile(`/oeuvre/${oeuvre[i].author}/${oeuvre[i]._id}/${names[j]}`))
                    }
                }
            }
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
            for (let i=0 ;i<oeuvre.length;i++){
                if(oeuvre[i].isMediaTypeImages){
                    names = oeuvre[i].illustration
                    oeuvre[i].illustration = []
                    for(let j=0;j<names.length;j++){
                        oeuvre[i].illustration.push(await minio.getFile(`/oeuvre/${oeuvre[i].author}/${oeuvre[i]._id}/${names[j]}`))
                    }
                }
            }
            return oeuvre;
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }

}

async function getLikedArt(id){
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'id':id}
        const collection = db.collection('User');
        let user = await collection.findOne(query);
        if (user==null) {
            return {'error':'User not found'};
        }else{
            let likedPosts = []
            for(let i=0;i<user.likedPosts.length;i++){
                query = {'_id':new ObjectId(user.likedPosts[i])}
                let post = await db.collection("Oeuvre").findOne(query)
                if(post.isMediaTypeImages){
                    names = post.illustration
                    post.illustration = []
                    for(let j=0;j<names.length;j++){
                        post.illustration.push(await minio.getFile(`/oeuvre/${post.author}/${post._id}/${names[j]}`))
                    }
                }
                likedPosts.push(post)
            }
            return likedPosts;
        }
    } catch (err) {
        console.log(err)
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
        if(toSell==null) toSell=false;
        if(price==null) price=0;
        if(linkToBuy==null) linkToBuy="";
        if(canTchat==null) canTchat=false;
        let newOeuvre = {
            title: title,
            description: description,
            category: category,
            subCategory: subCategory,
            illustration: illustration,
            video: video,
            postDate:new Date(postDate),
            releaseDate: new Date(releaseDate),
            illustration: illustration.map((elem)=>elem.originalname),
            isMediaTypeImages: Boolean(isMediaTypeImages),
            author: author,
            likeCount: 0,
            toSell: Boolean(toSell),
            price: price,
            linkToBuy: linkToBuy,
            canTchat: Boolean(canTchat),
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
        for(let i=0;i<illustration.length;i++){
            minio.uploadFile(`/oeuvre/${author}/${result.insertedId}/${illustration[i].originalname}`,illustration[i])
        }
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

async function checkIfOeuvreExist(id){
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'_id':new ObjectId(id)}
        const collection = db.collection('Oeuvre');
        let oeuvre = await collection.findOne(query);
        if (oeuvre==null) {
            return false;
        }else{
            return true;
        }
    } catch (err) {
        console.log(err)
        throw err;
    }
    finally{
        if(client) client.close();
    }
}

async function createNewList(userId,listName,listImage,listDescription){
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'id':userId}
        const collection = db.collection('User');
        let user = await collection.findOne(query);
        if (user==null) {
            return {'error':'User not found'};
        }else{
            let newList = {
                listName: listName,
                listImage: listImage,
                listDescription: listDescription,
                listOeuvre:[]
            };
            user.lists.push(newList);
            let result = await collection.updateOne(query,{$set:user})
            return result;
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }

}


async function addOeuvreToList(userId,listName,oeuvreId){
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'id':userId}
        const collection = db.collection('User');
        let user = await collection.findOne(query);
        if (user==null) {
            return {'error':'User not found'};
        }else{
            let list = user.lists.find((elem)=>elem.listName==listName)
            if(list==null){
                return {'error':'List not found'};
            }else{
                if(list.listOeuvre.find((elem)=>elem==oeuvreId)!=null){
                    return {'error':'Oeuvre already in list'};
                }
                list.listOeuvre.push(oeuvreId);
                let result = await collection.updateOne(query,{$set:user});
                return result;
            }
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }
}

async function removeOeuvreFromList(userId,listName,oeuvreId){
    try {
        await client.connect();
        const db = client.db(bdd);
        let query = {'id':userId}
        const collection = db.collection('User');
        let user = await collection.findOne(query);
        if (user==null) {
            return {'error':'User not found'};
        }else{
            let list = user.lists.find((elem)=>elem.listName==listName)
            if(list==null){
                return {'error':'List not found'};
            }else{
                if(list.listOeuvre.find((elem)=>elem==oeuvreId)==null){
                    return {'error':'Oeuvre not in list'};
                }
                list.listOeuvre.splice(list.listOeuvre.indexOf(oeuvreId),1);
                let result = await collection.updateOne(query,{$set:user});
                return result;
            }
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
    getLikedArt,
    likePost,
    dislikePost,
    addOeuvre,
    updateOeuvre,
    deleteOeuvre,
    checkIfOeuvreExist,
    createNewList,
    addOeuvreToList,
    removeOeuvreFromList,
}