const express = require('express')
const mongodb = require('../Database/userDB')
const jwt = require('../auth/jwt')
const user = express.Router()

user.get('/connect',async(req,resp)=>{
    if(req.body.mail!=null && req.body.password!=null){
        try{
            let user = await mongodb.checkUser(req.body.mail,req.body.password)
            if(user.mail!=null){
                let token = jwt.createToken({'userdata':{'mail':user.mail,'permission':user.permission}})
                resp.status(201).json({'token':token})
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
    if(req.body.mail!=null && req.body.password!=null && req.body.firstName!=null && req.body.lastName!=null){
        try{
            let user = await mongodb.createUser(req.body.mail, req.body.password, req.body.firstName, req.body.lastName)
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
user.put('/update',async(rep,res)=>{
    if(rep.body.mail!=null && rep.body.password!=null && rep.body.firstName!=null && rep.body.lastName!=null && rep.headers.token!=null){
        try {
            let value = jwt.getToken(rep.headers.token)
            if(value.userdata.permission == 'admin' || value.userdata.mail==rep.body.mail){
                let user = await mongodb.updateUser(rep.body.mail, rep.body.password, rep.body.firstName, rep.body.lastName,value.userdata.permission)
                if(user){
                    res.status(201).json(user)
                }
                else{
                    res.status(401).json(user)
                }
            } else {
                res.status(401).json({error: "Unauthorized"})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({error})
        }
    }else{
        res.status(400).json({error: "Bad request"})
    }
})
user.delete('/delete',async(rep,res)=>{
    if(rep.body.mail!=null && rep.body.password!=null && rep.headers.token!=null){
        try {
            let value = jwt.getToken(rep.headers.token)
            if(value.userdata.permission == 'admin'){
                let user = await mongodb.deleteUser(rep.body.mail, rep.body.password)
                if(user){
                    res.status(201).json(user)
                }
                else{
                    res.status(401).json(user)
                }
            } else {
                res.status(401).json({error: "Unauthorized"})
            }
        } catch (error) {
            res.status(500).json({error})
        }
    }else{
        res.status(400).json({error: "Bad request"})
    }
})

module.exports = user
