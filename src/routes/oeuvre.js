const express = require('express')
const mongodb = require('../Database/oeuvreDB')
const jwt = require('../auth/jwt')
const { CopySourceOptions } = require('minio')
const multer = require('multer');
const upload = multer();
const oeuvre = express.Router()

/**
 * @useage : Récupérer une oeuvre a travers son id
 * @param token in headers : token de l'utilisateur connecté
 */
oeuvre.post('/getArtById',async(req,resp)=>{
    if(req.body.id!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.getIdOeuvre(req.body.id)
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

/**
 * @useage : Récupérer les oeuvres d'un auteur
 * @param token in headers : token de l'utilisateur connecté
 * @param author in body : id de l'auteur pour récupérer ses oeuvres
 */
oeuvre.post('/getIdUser',async(req,resp)=>{
    if(req.body.author!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.getAuthorOeuvre(req.body.author)
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
/**
 * @useage : Récupérer toutes les oeuvres
 */
oeuvre.post('/getAll',async(req,resp)=>{
    try{
        // jwt.getToken(req.headers.token)
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
/**
 * @useage : Récupéré toutes les id des oeuvres
 */
oeuvre.post('/getAllIds',async(req,resp)=>{
    try{
        // jwt.getToken(req.headers.token)
        let oeuvre = await mongodb.getAllIdOeuvre()
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
/**
 * @useage : Récupérer les oeuvres d'une catégorie
 * @param token in headers : token de l'utilisateur connecté
 * @param category in body : catégorie de l'oeuvre à chercher
 * @param subCategory in body : sous catégorie de l'oeuvre à chercher
 */
oeuvre.post('/getCat',async(req,resp)=>{
    if(req.body.category!=null && req.body.subCategory!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.getCatOeuvre(req.body.category,req.body.subCategory)
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
/**
 * @useage : Récupérer les oeuvres likées par un utilisateur
 * @param token in headers : token de l'utilisateur connecté
 * @param userId in body : id de l'utilisateur
 */
oeuvre.post('/getLikedArt',async(req,resp)=>{
    if(req.body.userId!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.getLikedArt(req.body.userId)
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
/**
 * @useage : Like une oeuvre
 * @param token in headers : token de l'utilisateur connecté
 * @param postId in body : id de l'oeuvre à liker
 */
oeuvre.post('/likePost', async (req,resp)=>{
    if(req.body.postId!=null && req.body.userId!=null){
        // value = jwt.getToken(req.headers.token)
        // if(value.userdata.permission == 'admin' || value.userdata.id==req.body.id){
        try{
            let oeuvre = await mongodb.likePost(req.body.postId,req.body.userId)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(error){
            resp.status(500).json({error})
        }
        // } else {
        //     resp.status(401).json({error: "Unauthorized"})
        // }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
/**
 * @useage : Supprime le like d'une oeuvre par un utilisateur
 * @param token in headers : token de l'utilisateur connecté
 * @param postId in body : id de l'oeuvre à disliker
 */
oeuvre.post('/dislikePost', async (req,resp)=>{
    if(req.body.postId!=null && req.body.userId!=null){
        // jwt.getToken(req.headers.token)
        // if(value.userdata.permission == 'admin' || value.userdata.id==req.body.id){
        try{
            let oeuvre = await mongodb.dislikePost(req.body.postId,req.body.userId)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(error){
            resp.status(500).json({error})
        }
        // } else {
        //     resp.status(401).json({error: "Unauthorized"})
        // }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
/**
 * @useage : Ajouter une oeuvre
 * @param token in headers : token de l'utilisateur connecté
 * @param title in body : titre de l'oeuvre
 * @param description in body : description de l'oeuvre
 * @param author in body : id de l'auteur de l'oeuvre
 * @param category in body : catégorie de l'oeuvre
 * @param subCategory in body : sous catégorie de l'oeuvre
 * @param illustration in body : illustration de l'oeuvre
 * @param video in body : video de l'oeuvre
 * @param isMediaTypeImages in body : type de média de l'oeuvre
 * @param toSell in body : si l'oeuvre est à vendre
 * @param price in body : prix de l'oeuvre
 */
oeuvre.post('/addOeuvre',upload.array('illustration'),async (req,resp)=>{
    if(
        req.body.title!=null &&
        req.body.description!=null &&
        req.body.author!=null &&
        req.body.category!=null &&
        req.body.subCategory!=null &&
        (req.files!=null ||req.body.video!='') &&
        req.body.isMediaTypeImages!=null
    ){
        console.log(req.body)
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.addOeuvre(req.body.title, req.body.description, req.body.author, req.body.category, req.body.subCategory, req.files, req.body.video, req.body.postDate,req.body.releaseDate,req.body.isMediaTypeImages,req.body.toSell,req.body.price,req.body.linkToBuy,req.body.canTchat)
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
/**
 * @useage : Mettre à jour une oeuvre
 * @param token in headers : token de l'utilisateur connecté
 * @param id in body : id de l'oeuvre à mettre à jour
 * @param title in body : titre de l'oeuvre
 * @param description in body : description de l'oeuvre
 * @param author in body : id de l'auteur de l'oeuvre
 * @param category in body : catégorie de l'oeuvre
 * @param subCategory in body : sous catégorie de l'oeuvre
 * @param illustration in body : illustration de l'oeuvre
 * @param video in body : video de l'oeuvre
 * @param isMediaTypeImages in body : type de média de l'oeuvre
 * @param toSell in body : si l'oeuvre est à vendre
 */
oeuvre.put('/updateArt',async (req,resp)=>{
    if(req.body.id!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.updateOeuvre(req.body.id,req.body.title, req.body.description, req.body.author, req.body.category, req.body.subCategory, req.body.illustration, req.body.video, req.body.isMediaTypeImages, req.body.likeCount,req.body.toSell,req.body.price,req.body.linkToBuy,req.body.canTchat)
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
/**
 * @useage : Supprimer une oeuvre
 * @param token in headers : token de l'utilisateur connecté
 * @param id in body : id de l'oeuvre à supprimer
 */
oeuvre.delete('/deleteArt',async (req,resp)=>{
    if(req.body.id!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.deleteOeuvre(req.body.id)
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
/**
 * @useage : Vérifier si une oeuvre existe
 * @param token in headers : token de l'utilisateur connecté
 * @param id in body : id de l'oeuvre à vérifier
 */
oeuvre.post('/checkIfArtExist', async (req,resp)=>{
    if(req.body.id!=null){
        try{
            // jwt.getToken(req.headers.token)
            let oeuvre = await mongodb.checkIfOeuvreExist(req.body.id)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(err){
            resp.status(500).json({err})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})

/**
 * @useage : Crée une liste pour un utilisateur
 * @param token in headers : token de l'utilisateur connecté
 * @param userId in body : id de l'utilisateur
 * @param listName in body : nom de la liste
 * @param listImage in body : image de la liste
 * @param listDescription in body : description de la liste
 */
oeuvre.post('/createNewList',async(rep,resp)=>{
    if(rep.body.userId!=null && rep.body.listName!=null && rep.body.listImage != null && rep.body.listDescription != null){
        try{
            let oeuvre = await mongodb.createNewList(rep.body.userId,rep.body.listName,rep.body.listImage,rep.body.listDescription)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(err){
            resp.status(500).json({err})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
/**
 * @useage : Ajoute une oeuvre à une liste
 * @param token in headers : token de l'utilisateur connecté
 * @param userId in body : id de l'utilisateur
 * @param listName in body : nom de la liste
 */
oeuvre.post('/addArtToList',async(rep,resp)=>{
    if(rep.body.userId!=null && rep.body.listName!=null && rep.body.oeuvreId != null){
        try{
            let oeuvre = await mongodb.addOeuvreToList(rep.body.userId,rep.body.listName,rep.body.oeuvreId)
            if(oeuvre){
                resp.status(201).json(oeuvre)
            }
            else{
                resp.status(401).json(oeuvre)
            }
        }catch(err){
            resp.status(500).json({err})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
/**
 * @useage : Enlever une oeuvre d'une liste
 * @param token in headers : token de l'utilisateur connecté
 * @param userId in body : id de l'utilisateur
 * @param listName in body : nom de la liste
 * @param oeuvreId in body : id de l'oeuvre
 */
oeuvre.post('/removeArtFromList',async(req,res)=>{
    if(req.body.userId!=null && req.body.listName!=null && req.body.oeuvreId != null){
        try{
            let oeuvre = await mongodb.removeOeuvreFromList(req.body.userId,req.body.listName,req.body.oeuvreId)
            if(oeuvre){
                res.status(201).json(oeuvre)
            }
            else{
                res.status(401).json(oeuvre)
            }
        }catch(err){
            res.status(500).json({err})
        }
    }else{
        res.status(400).json({error: "Bad request"})
    }
});

module.exports = oeuvre