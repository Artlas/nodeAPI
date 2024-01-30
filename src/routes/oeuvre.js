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
oeuvre.post('/getIdUser',async(req,resp)=>{
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
oeuvre.post('/getAllIds',async(req,resp)=>{
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
oeuvre.post('/dislikePost', async (req,resp)=>{
    if(req.body.postId!=null && req.body.userId!=null){
        // jwt.getToken(req.headers.token)
        // if(value.userdata.permission == 'admin' || value.userdata.id==req.body.id){
        try{
            let oeuvre = await mongodb.dislikePost(req.body.postId,req.body.userId)
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
        req.body.isMediaTypeImages!=null
    ){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.addOeuvre(req.body.title, req.body.description, req.body.author, req.body.category, req.body.subCategory, req.body.illustration, req.body.video, req.body.isMediaTypeImages, req.body.toSell,req.body.price,req.body.linkToBuy,req.body.canTchat)
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
oeuvre.put('/updateArt',async (req,resp)=>{
    if(req.body.id!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.updateOeuvre(req.body.id,req.body.title, req.body.description, req.body.author, req.body.category, req.body.subCategory, req.body.illustration, req.body.video, req.body.isMediaTypeImages, req.body.likeCount,req.body.toSell,req.body.price,req.body.linkToBuy,req.body.canTchat)
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
oeuvre.delete('/deleteArt',async (req,resp)=>{
    if(req.body.id!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.deleteOeuvre(req.body.id)
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

oeuvre.post('/checkIfArtExist', async (req,resp)=>{
    if(req.body.id!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.checkIfOeuvreExist(req.body.id)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(err){
            resp.status(500).json({err})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})


oeuvre.post('/createNewList',async(rep,resp)=>{
    if(rep.body.userId!=null && rep.body.listName!=null && rep.body.listImage != null && rep.body.listDescription != null){
        try{
            let oeuvre = await mongodb.createNewList(rep.body.userId,rep.body.listName,rep.body.listImage,rep.body.listDescription)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(err){
            resp.status(500).json({err})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
oeuvre.post('/addArtToList',async(rep,resp)=>{
    if(rep.body.userId!=null && rep.body.listName!=null && rep.body.oeuvreId != null){
        try{
            let oeuvre = await mongodb.addOeuvreToList(rep.body.userId,rep.body.listName,rep.body.oeuvreId)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(err){
            resp.status(500).json({err})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})

oeuvre.post('/removeArtFromList',async(req,res)=>{
    if(req.body.userId!=null && req.body.listName!=null && req.body.oeuvreId != null){
        try{
            let oeuvre = await mongodb.removeOeuvreFromList(req.body.userId,req.body.listName,req.body.oeuvreId)
            if(oeuvre){
                res.status(201).json(oeuvre)
            }
            else{
                res.status(401).json(oeuvre)
            }
        }catch(err){
            res.status(500).json({err})
        }
    }else{
        res.status(400).json({error: "Bad request"})
    }
});

module.exports = oeuvre