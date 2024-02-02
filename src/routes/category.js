const express = require('express')
const mongodb = require('../Database/categoryDB')
const jwt = require('../auth/jwt')
const category = express.Router()

/**
 * @useage : get all category
 */
category.post('/getAllCat',async(req,resp)=>{
    try{
        let category = await mongodb.getCategory(req.body.category)
        if(category){
            resp.status(201).json(category)
        }
        else{
            resp.status(401).json(category)
        }
    }catch(error){
        resp.status(500).json({error})
    }
})
/**
 * @useage : add a category
 * @param category : nom de la catégorie
 * @param miniatureLink : lien miniature
 */
category.post('/addCat',async(req,resp)=>{
    if(req.body.category!=null && req.body.miniatureLink!=null){
        try{
            jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.addCat(req.body.category,req.body.miniatureLink)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(error){
            resp.status(500).json({error})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
/**
 * @useage : add a sub category
 * @param category : nom de la catégorie
 * @param subCategory : nom de la sous catégorie
 * @param miniatureLink : lien miniature
 */
category.post('/addSubCat', async(req,resp)=>{
    if(req.body.category!=null && req.body.subCategory!=null && req.body.miniatureLink!=null){
        try{
            jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.addSubCat(req.body.category,req.body.subCategory,req.body.miniatureLink)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(error){
            resp.status(500).json({error})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
/**
 * @useage : update a category
 * @param category : nom de la catégorie
 * @param newCategory : nouveau nom de la catégorie
 * @param newMiniatureLink : nouveau lien miniature
 */
category.put('/updateCat', async(req,resp)=>{
    if(req.body.category!=null && req.body.newCategory!=null,req.body.newMiniatureLink!=null){
        try{
            jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.updateCat(req.body.category,req.body.newCategory,req.body.newMiniatureLink)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(error){
            resp.status(500).json({error})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
/**
 * @useage : update a sub category
 * @param category : nom de la catégorie
 * @param subCategory : nom de la sous catégorie
 * @param newSubCategory : nouveau nom de la sous catégorie
 * @param newMiniatureLink : nouveau lien miniature
 */
category.put('/updateSubCat',async(req,resp)=>{
    if(req.body.category!=null && req.body.subCategory!=null && req.body.newSubCategory!=null && req.body.newMiniatureLink!=null){
        try{
            jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.updateSubCat(req.body.category,req.body.subCategory,req.body.newSubCategory,req.body.newMiniatureLink)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(error){
            resp.status(500).json({error})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
/**
 * @useage : delete a category
 * @param category : nom de la catégorie
 */
category.delete('/deleteCat',async(req,resp)=>{
    if(req.body.category!=null){
        try{
            let value = jwt.getToken(req.headers.token)
            if(value.userdata.permission == 'admin'){
                let oeuvre = await mongodb.deleteCat(req.body.category)
                if(oeuvre){
                    resp.status(201).json(oeuvre)
                }
                else{
                    resp.status(401).json(oeuvre)
                }
            } else{
                resp.status(401).json({error: "Unauthorized"})
            }
        }catch(error){
            resp.status(500).json({error})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
/**
 * @useage : delete a sub category
 * @param category : nom de la catégorie
 * @param subCategory : nom de la sous catégorie
 */
category.delete('/deleteSubCat',async(req,resp)=>{
    if(req.body.category!=null && req.body.subCategory!=null){
        try{
            let value = jwt.getToken(req.headers.token)
            if(value.userdata.permission == 'admin'){
                let oeuvre = await mongodb.deleteSubCat(req.body.category,req.body.subCategory)
                if(oeuvre){
                    resp.status(201).json(oeuvre)
                }
                else{
                    resp.status(401).json(oeuvre)
                }
            } else{
                resp.status(401).json({error: "Unauthorized"})
            }
        }catch(error){
            resp.status(500).json({error})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})

module.exports = category