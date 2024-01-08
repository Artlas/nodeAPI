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

module.exports = category