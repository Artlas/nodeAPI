const express = require('express')
const mongodb = require('../Database/mongodb')
const mariadb = require('../mariadb')

const apiUp = express.Router()

apiUp.get('/',(req,resp)=>{
    async function run(){
        let respObj = {
            status: false,
            mongodb: false
        }
        try {
            await mongodb.checkConnection()
            respObj.status = true
            respObj.mongodb = true
        } catch (error) {
            respObj.status = true
            respObj.mongodb = false
            console.error(error)
        }
        resp.status(201).json(respObj)
    }
    run()
})
module.exports = apiUp