const express = require('express')
const mongodb = require('../Database/userDB')
const jwt = require('../auth/jwt')
const user = express.Router()
user.get('/connect',async(req,resp)=>{
    if((req.body.mail!=null || req.body.id!=null) && req.body.password!=null){
        try{
            let user = await mongodb.checkUser(req.body.mail,req.body.id,req.body.password)
            if(user.mail!=null){
                let token = jwt.createToken({'userdata':{'id':user.id,'permission':user.permission}})
                resp.status(201).json(
                    {'user':{
                        'token':token,
                        'id':user.id,
                        'mail':user.mail,
                        'firstName':user.firstName,
                        'lastName':user.lastName,
                        'birthdate':user.birthdate,
                        'address':user.address,
                        'image':user.image,
                        'permission':user.permission
                    }})
            } else {
                resp.status(401).json(user)
            }
        }catch(error){
            console.log(error)
            resp.status(500).send(error)
        }

    } else {
        resp.status(400).json({error: "Bad request"})
    }
})
user.post('/connect',async(req,resp)=>{
    if((req.body.mail!=null || req.body.id!=null) && req.body.password!=null){
        try{
            let user = await mongodb.checkUser(req.body.mail,req.body.id,req.body.password)
            if(user.mail!=null){
                let token = jwt.createToken({'userdata':{'id':user.id,'permission':user.permission}})
                resp.status(201).json(
                    {'user':{
                        'token':token,
                        'id':user.id,
                        'mail':user.mail,
                        'firstName':user.firstName,
                        'lastName':user.lastName,
                        'birthdate':user.birthdate,
                        'address':user.address,
                        'image':user.image,
                        'permission':user.permission
                    }})
            } else {
                resp.status(401).json(user)
            }
        }catch(error){
            console.log(error)
            resp.status(500).send(error)
        }

    } else {
        resp.status(400).json({error: "Bad request"})
    }
})
user.post('/add',async(req,resp)=>{
    if(req.body.id!=null && req.body.mail!=null && req.body.password!=null && req.body.firstName!=null && req.body.lastName!=null && req.body.birthdate!=null && req.body.address!=null){
        try{
            let user = await mongodb.createUser(req.body.id, req.body.mail, req.body.password, req.body.firstName, req.body.lastName, req.body.birthdate, req.body.address, req.body.image)
            if(user){
                resp.status(201).json(user)
            }
            else{
                resp.status(401).json(user)
            }
        }catch(error){
            resp.status(500).json({error})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
user.put('/update',async(req,resp)=>{
    if(req.body.id!=null && req.body.mail!=null && req.body.password!=null && req.body.firstName!=null && req.body.lastName!=null && req.body.birthdate!=null && req.body.address!=null && req.body.image!=null){
        try {
            let value = jwt.getToken(req.headers.token)
            if(value.userdata.permission == 'admin' || value.userdata.id==req.body.id){
                let user = await mongodb.updateUser(req.body.id, req.body.mail, req.body.password, req.body.firstName, req.body.lastName, req.body.birthdate, req.body.address,req.body.image, value.userdata.permission)
                if(user){
                    resp.status(201).json(user)
                }
                else{
                    resp.status(401).json(user)
                }
            } else {
                resp.status(401).json({error: "Unauthorized"})
            }
        } catch (error) {
            console.log(error)
            resp.status(500).json({error})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
user.delete('/delete',async(req,resp)=>{
    if((req.body.mail!=null || req.body.id!=null) && req.body.password!=null && req.headers.token!=null){
        try {
            let value = jwt.getToken(req.headers.token)
            if(value.userdata.permission == 'admin'){
                let user = await mongodb.deleteUser(req.body.mail, req.body.password)
                if(user){
                    resp.status(201).json(user)
                }
                else{
                    resp.status(401).json(user)
                }
            } else {
                resp.status(401).json({error: "Unauthorized"})
            }
        } catch (error) {
            resp.status(500).json({error})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})

module.exports = user
