const express = require('express')
const mariadb = require('../mariadb')
const mongodb = require('../mongodb')

const user = express.Router()

user.get('/token',(req,resp)=>{
    async function run(){
        try {
            let user = await mongodb.checkUser(req.body.mail,req.body.password)
            if(user){
                console.log(user)
                let token = await mongodb.getTokenForUser(req.body.mail)
                resp.status(200).json({'token':token[0].token,'expireTime':token[0].expireTime})
            }
            else{
                resp.status(401).json(user)
            }
        }catch (error) {
            //console.error(error)
            resp.status(500).json({error})
        }
    }
    if(req.body.mail!=null && req.body.password!=null){
       run()
    } else {
        resp.status(400).json({error: "Bad request"})
    }
})
user.post('/add',async(req,resp)=>{
    if(req.body.mail!=null && req.body.password!=null && req.body.firstName!=null && req.body.lastName!=null){
        let sql="SELECT * FROM users WHERE mail=?"
        let values=[req.body.mail]
        try {
            let result = await mariadb.query(sql,values)
            if(result.length==0){
                sql = "INSERT INTO `users` (`mail`,`password`,`firstName`,`lastName`) VALUES (?,?,?,?);"
                values = [req.body.mail,req.body.password,req.body.firstName,req.body.lastName]
                await mariadb.query(sql,values)
                resp.status(201).json({message: "User created"})
            }
            else{
                resp.status(401).json({error: "User have already an account"})
            }
        }
        catch (error) {
            console.error(error)
            resp.status(500).json({error})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
user.put('/update',async(rep,res)=>{
    if(rep.body.mail!=null && rep.body.password!=null && rep.body.firstName!=null && rep.body.lastName!=null && rep.headers.token!=null){
        let sql="SELECT * FROM users WHERE mail=?"
        let values=[rep.body.mail]
        try {
            let tokenVal = await mariadb.checkToken(rep.headers.token)
            if(!tokenVal){
                res.status(401).json({error:"Unauthorized"})
            }
            let result = await mariadb.query(sql,values)
            if(result.length==0){
                res.status(404).json({error: "User not found"})
            }else if(result[0].id==tokenVal[0].userId){
                sql = "UPDATE `users` SET `password`=?,`firstName`=?,`lastName`=? WHERE `mail`=?;"
                values = [rep.body.password,rep.body.firstName,rep.body.lastName,rep.body.mail]
                await mariadb.query(sql,values)
                res.status(200).json({message: "User updated"})
            }else{
                res.status(401).json({error: "Unauthorized"})
            }
        }
        catch (error) {
            console.error(error)
            res.status(500).json({error})
        }
    }else{
        res.status(400).json({error: "Bad request"})
    }
})
user.delete('/delete',async(rep,res)=>{
    if(rep.body.mail!=null && rep.header.token){
        let sql="SELECT * FROM users WHERE mail=?"
        let values=[rep.body.mail]
        try {
            let result = await mariadb.query(sql,values)
            if(result.length==0){
                res.status(404).json({error: "User not found"})
            }
            else{
                sql = "DELETE FROM `users` WHERE `mail`=?;"
                values = [rep.body.mail]
                await mariadb.query(sql,values)
                res.status(200).json({message: "User deleted"})
            }
        }
        catch (error) {
            console.error(error)
            res.status(500).json({error})
        }
    }else{
        res.status(400).json({error: "Bad request"})
    }
})
user.delete('/endToken',async(rep,res)=>{
    if(rep.body.token!=null){
        try {
            let val = await mariadb.checkToken(rep.body.token)
            if(!val){
                res.status(401).json({error:"Unauthorized"})
            }else{
                sql = "DELETE FROM `token` WHERE `token`=?;"
                values = [rep.body.token]
                await mariadb.query(sql,values)
                res.status(200).json({message: "Token deleted"})
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({error})
        }
    }else{
        res.status(400).json({error: "Bad request"})
    }
})

module.exports = user
