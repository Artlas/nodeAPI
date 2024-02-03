var Minio = require('minio')
var fs = require('fs');
const { response } = require('express');
var bucketName = 'artlas'
var minioClient = new Minio.Client({
    endPoint: 'minio.fournierfamily.ovh',
    accessKey: 'ZSHhf9kMKuHSV4S8sZHn',
    secretKey: 'B9qQvJUab3BDFLFsGesC7IJsxJ2YPlc6Np4q62LK',
});

async function uploadFile(pathName,fileUp){
    try{
        await minioClient.putObject(bucketName, pathName, fileUp.buffer);
        return {code:'OK',message:`file ${fileUp} uploaded successfully`}
    }catch(err){
        console.log(`error in uploading the file ${fileUp}: ${err}`);
        return {code:'ERROR',message:`Error in uploading the file ${fileUp}: ${err}`};
    }
}

async function getFile(pathName){
    const promise = new Promise((resolve, reject) => {
        var buff = [];
        minioClient.getObject(bucketName,pathName).then(function(dataStream) {
            dataStream.on('data', async function(chunk) {
                buff.push(chunk);
            });
            dataStream.on('end', function() {
                buff = Buffer.concat(buff).toString("base64");
                resolve(buff);
            });
            dataStream.on('error', function(err) {
                reject(err);
            });
        }, function(err) {
            reject(err);
        })
    })
    return promise
}
async function deleteFile(fileName){
    try{
        let file = await minioClient.removeObject(bucketName, fileName)
        return file
    }
    catch(error){
        throw error
    }
}
module.exports={uploadFile,getFile,deleteFile}


