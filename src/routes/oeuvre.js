const express = require('express')
const mongodb = require('../Database/oeuvreDB')
const jwt = require('../auth/jwt')
const oeuvre = express.Router()

oeuvre.post('/getId',async(req,resp)=>{
    if(req.body.id!=null){
        try{
            jwt.getToken(req.headers.token)
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

oeuvre.post('/getAll',async(req,resp)=>{
    try{
        jwt.getToken(req.headers.token)
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
oeuvre.post('/getCat',async(req,resp)=>{
    if(req.body.category!=null && req.body.subCategory!=null){
        try{
            jwt.getToken(req.headers.token)
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


module.exports = oeuvre