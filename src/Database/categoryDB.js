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
async function addCat(category,miniatureLink){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('Art');
        let query = {'name':category};
        let categoryExist = await collection.findOne(query);
        if (categoryExist==null) {
            let result = await collection.insertOne({'name':category,'subcategories':[{'name':'all','miniature':miniatureLink}],'miniatureLink':miniatureLink,'isShown':false})
            return result;
        }else{
            return {'error':'Category already exist'};
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }
}
async function addSubCat(category,subCategory,miniatureLink){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('Art');
        let query = {'name':category}
        let categoryExist = await collection.findOne(query);
        if (categoryExist==null) {
            return {'error':'Category not found'};
        }else{
            subQuery= {'name':category,'subcategories':{$elemMatch:{'name':subCategory}}};
            let subCategoryExist = await collection.findOne(subQuery);
            if (subCategoryExist==null) {
                let result = await collection.updateOne({'name':category},{$push:{'subcategories':{'name':subCategory,'miniature':miniatureLink}}})
                return result;
            }else{
                return {'error':'subCategories already exist'};
            }
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }
}
async function updateCat(category,newCategory,newMiniatureLink){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('Art');
        let query = {'name':category}
        let categoryExist = await collection.findOne(query);
        if (categoryExist==null) {
            return {'error':'Category not found'};
        }else{
            let query = {'name':newCategory}
            let categoryExist = await collection.findOne(query);
            if (categoryExist==null) {
                let result = await collection.updateOne({'name':category},{$set:{'name':newCategory,'miniatureLink':newMiniatureLink}})
                return result;
            }else{
                return {'error':'Category already exist'};
            }
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }
}
async function updateSubCat(category,subCategory,newSubCategory,newMiniatureLink){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('Art');
        let query = {'name':category}
        let categoryExist = await collection.findOne(query);
        if (categoryExist==null) {
            return {'error':'Category not found'};
        }else{
            let subQuery= {'name':category,'subcategories':{$elemMatch:{'name':subCategory}}};
            let subCategoryExist = await collection.findOne(subQuery);
            if (subCategoryExist==null) {
                return {'error':'SubCategory not found'};
            }else{
                let result = await collection.updateOne({ 'name':category, "subcategories.name": subCategory },{ $set: { "subcategories.$.name": newSubCategory, "subcategories.$.miniature": newMiniatureLink } })
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
async function deleteCat(category){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('Art');
        let query = {'name':category}
        let categoryExist = await collection.findOne(query);
        if (categoryExist==null) {
            return {'error':'Category not found'};
        }else{
            let result = await collection.deleteOne({'name':category})
            return result;
        }
    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        if (client) client.close();
    }
}
async function deleteSubCat(category,subCategory){
    try {
        await client.connect();
        const db = client.db(bdd);
        const collection = db.collection('Art');
        let query = {'name':category}
        let categoryExist = await collection.findOne(query);
        if (categoryExist==null) {
            return {'error':'Category not found'};
        }else{
            let subQuery= {'name':category,'subcategories':{$elemMatch:{'name':subCategory}}};
            let subCategoryExist = await collection.findOne(subQuery);
            if (subCategoryExist==null) {
                return {'error':'SubCategory not found'};
            }else{
                let result = await collection.updateOne({'name':category},{$pull:{'subcategories':{'name':subCategory}}})
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
    getCategory,
    addCat,
    addSubCat,
    updateCat,
    updateSubCat,
    deleteCat,
    deleteSubCat
}