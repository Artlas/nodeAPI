const express = require('express')
const mongodb = require('../Database/mongodb')
const mariadb = require('../mariadb')
const multer = require('multer');
const upload = multer();
const minio = require('../Database/minio')

const apiUp = express.Router()

/**
 * @usage : verification que l'api est en ligne
 */
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
apiUp.post('/test',upload.single('illustration'),(req,resp)=>{
    if(!req.file){
        resp.status(400).json({status:false})
    } else {
        minio.uploadFile(`${req.body.url}/${req.file.originalname}`,req.file)
    }
    resp.status(201).json({status:true})
})
module.exports = apiUp