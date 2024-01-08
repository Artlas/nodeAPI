const express = require('express')
const mongodb = require('../Database/categoryDB')
const jwt = require('../auth/jwt')
const category = express.Router()

category.post('/get',async(req,resp)=>{
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