const express = require('express')
const mariadb = require('../mariadb')

const user = express.Router()

user.get('/',(req,resp)=>{
    async function run(){
        try {
            if(req.body.user!=null && req.body.pwd!=null){
                resp.status(201).json(req.body)
            }
            else{
                resp.status(400).json({error: "Bad request"})
            }
        } catch (error) {
            console.error(error)
            resp.status(500).json({error})
        }
    }
    run()
})

module.exports = user
