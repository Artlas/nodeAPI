const express = require('express')
const mongodb = require('../Database/oeuvreDB')
const jwt = require('../auth/jwt')
const oeuvre = express.Router()

oeuvre.post('/getId',async(req,resp)=>{
    if(req.body.id!=null){
        try{
            jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.getOeuvreId(req.body.id)
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


module.exports = oeuvre