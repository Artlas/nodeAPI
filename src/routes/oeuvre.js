const express = require('express')
const mongodb = require('../Database/oeuvreDB')
const jwt = require('../auth/jwt')
const oeuvre = express.Router()

oeuvre.post('/getId',async(req,resp)=>{
    if(req.body.id!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.getIdOeuvre(req.body.id)
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
oeuvre.post('/getAuthorOeuvre',async(req,resp)=>{
    if(req.body.author!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.getAuthorOeuvre(req.body.author)
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
oeuvre.post('/getAll',async(req,resp)=>{
    try{
        // jwt.getToken(req.headers.token)
        let oeuvre = await mongodb.getAllOeuvre()
        if(oeuvre){
            resp.status(201).json(oeuvre)
        }
        else{
            resp.status(401).json(oeuvre)
        }
    }catch(error){
        resp.status(500).json({error})
    }
})
oeuvre.post('/getAllId',async(req,resp)=>{
    try{
        // jwt.getToken(req.headers.token)
        let oeuvre = await mongodb.getAllIdOeuvre()
        if(oeuvre){
            resp.status(201).json(oeuvre)
        }
        else{
            resp.status(401).json(oeuvre)
        }
    }catch(error){
        resp.status(500).json({error})
    }
})
oeuvre.post('/getCat',async(req,resp)=>{
    if(req.body.category!=null && req.body.subCategory!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.getCatOeuvre(req.body.category,req.body.subCategory)
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

oeuvre.post('/likePost', async (req,resp)=>{
    if(req.body.postId!=null && req.body.userId!=null){
        // jwt.getToken(req.headers.token)
        // if(value.userdata.permission == 'admin' || value.userdata.id==req.body.id){
        try{
            let oeuvre = await mongodb.likePost(req.body.postId,req.body.userId)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(error){
            resp.status(500).json({error})
        }
        // } else {
        //     resp.status(401).json({error: "Unauthorized"})
        // }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})

oeuvre.post('/addOeuvre',async (req,resp)=>{
    if(
        req.body.title!=null &&
        req.body.description!=null &&
        req.body.author!=null &&
        req.body.category!=null &&
        req.body.subCategory!=null &&
        (req.body.illustration!=null ||req.body.video!=null) &&
        req.body.isMediaTypeImages!=null &&
        req.body.likeCount!=null
    ){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.addOeuvre(req.body.title, req.body.description, req.body.author, req.body.category, req.body.subCategory, req.body.illustration, req.body.video, req.body.isMediaTypeImages, req.body.likeCount,req.body.toSell,req.body.price,req.body.linkToBuy,req.body.canTchat)
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

module.exports = oeuvre