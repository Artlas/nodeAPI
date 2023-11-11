const express = require('express')
const mongodb = require('../mongodb')

const apiUp = express.Router()

apiUp.get('/',(req,resp)=>{
    async function run(){
        let respObj
        try{
            await mongodb.connect();
            await mongodb.db('admin').command({ping:1});
            respObj = {
                status:'UP',
                dbStatus:'UP'
            }
        }catch(err){
            respObj = {
                status:'UP',
                dbStatus:'DOWN',
                error: err
            }
        }finally{
            await mongodb.close()
            resp.status(201).json(respObj)
        }
    }
    run()
})
module.exports = apiUp