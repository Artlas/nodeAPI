const express = require('express');
const mongodb = require('../Database/userDB');
const jwt = require('../auth/jwt');
const user = express.Router();
user.post('/connect', async (req, resp) => {
    if ((req.body.mail != null || req.body.id != null) && req.body.password != null) {
        try {
            let user = await mongodb.checkUser(req.body.mail, req.body.id, req.body.password);
            if (user.mail != null) {
                let token = jwt.createToken({ userdata: { id: user.id, permission: user.permission } });
                resp.status(201).json({
                    user: {
                        token: token,
                        id: user.id,
                        mail: user.mail,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        birthdate: user.birthdate,
                        address: user.address,
                        image: user.image,
                        permission: user.permission,
                    },
                });
            } else {
                resp.status(401).json(user);
            }
        } catch (error) {
            console.log(error);
            resp.status(500).send(error);
        }
    } else {
        resp.status(400).json({ error: 'Bad request' });
    }
});

user.put('/updatePassword',async(req,resp)=>{
    if(req.body.mail!=null && req.body.password!=null && req.body.newPassword!=null){
        try {
            let value = jwt.getToken(req.headers.token)
            if(value.userdata.permission == 'admin' || value.userdata.mail==req.body.mail){
                let user = await mongodb.updatePassword(req.body.mail, req.body.password, req.body.newPassword, value.userdata.permission)
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

user.post('/check', async (req, resp) => {
    if (req.body.mail != null || req.body.id != null) {
        try {
            let response = await mongodb.checkUserExists(req.body.mail, req.body.id);
            if (response.userExists) {
                resp.status(200).json({ message: 'User exists' });
            } else {
                resp.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.log(error);
            resp.status(500).send({ error: 'Internal server error', details: error });
        }
    } else {
        resp.status(400).json({ error: 'Bad request' });
    }
});

user.post('/add', async (req, resp) => {
    if (
        req.body.id != null &&
        req.body.mail != null &&
        req.body.password != null &&
        req.body.firstName != null &&
        req.body.lastName != null &&
        req.body.birthdate != null &&
        req.body.address != null
    ) {
        try {
            let user = await mongodb.createUser(req.body.id, req.body.mail, req.body.password, req.body.firstName, req.body.lastName, req.body.birthdate, req.body.address, req.body.image);
            if (user) {
                resp.status(201).json(user);
            } else {
                resp.status(401).json(user);
            }
        } catch (error) {
            resp.status(500).json({ error });
        }
    } else {
        resp.status(400).json({ error: 'Bad request' });
    }
});
user.put('/update', async (req, resp) => {
    if (
        req.body.id != null &&
        req.body.mail != null &&
        req.body.password != null &&
        req.body.firstName != null &&
        req.body.lastName != null &&
        req.body.birthdate != null &&
        req.body.address != null &&
        req.body.image != null
    ) {
        try {
            let value = jwt.getToken(req.headers.token);
            if (value.userdata.permission == 'admin' || value.userdata.id == req.body.id) {
                let user = await mongodb.updateUser(
                    req.body.id,
                    req.body.mail,
                    req.body.password,
                    req.body.firstName,
                    req.body.lastName,
                    req.body.birthdate,
                    req.body.address,
                    req.body.image,
                    value.userdata.permission
                );
                if (user) {
                    resp.status(201).json(user);
                } else {
                    resp.status(401).json(user);
                }
            } else {
                resp.status(401).json({ error: 'Unauthorized' });
            }
        } catch (error) {
            console.log(error);
            resp.status(500).json({ error });
        }
    } else {
        resp.status(400).json({ error: 'Bad request' });
    }
});
user.delete('/delete', async (req, resp) => {
    if ((req.body.mail != null || req.body.id != null) && req.body.password != null && req.headers.token != null) {
        try {
            let value = jwt.getToken(req.headers.token);
            if (value.userdata.permission == 'admin') {
                let user = await mongodb.deleteUser(req.body.mail, req.body.password);
                if (user) {
                    resp.status(201).json(user);
                } else {
                    resp.status(401).json(user);
                }
            } else {
                resp.status(401).json({ error: 'Unauthorized' });
            }
        } catch (error) {
            resp.status(500).json({ error });
        }
    } else {
        resp.status(400).json({ error: 'Bad request' });
    }
});
user.post('/getUserFolowers',async (req,resp)=>{
    if(req.body.id!=null){
        try{
            // let value = jwt.getToken(req.headers.token)
            let user = await mongodb.getUserFolowers(req.body.id)
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

user.post('/getUserFolowing',async (req,resp)=>{
    if(req.body.id!=null){
        try{
            // let value = jwt.getToken(req.headers.token)
            let user = await mongodb.getUserFolowing(req.body.id)
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

user.post('/followArtist', async (req,resp)=>{
    if(req.body.userId!=null && req.body.artistId!=null){
        try{
            // let value = jwt.getToken(req.headers.token)
            // if(value.userdata.permission == 'admin' || value.userdata.id==req.body.userId){
            let user = await mongodb.followArtist(req.body.userId,req.body.artistId)
            if(user){
                resp.status(201).json(user)
            }
            else{
                resp.status(401).json(user)
            }
            // } else {
            //     resp.status(401).json({error: "Unauthorized"})
            // }
        }catch(error){
            resp.status(500).json({error})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})
user.post('/unfollowArtist', async (req,resp)=>{
    if(req.body.userId!=null && req.body.artistId!=null){
        try{
            // let value = jwt.getToken(req.headers.token)
            // if(value.userdata.permission == 'admin' || value.userdata.id==req.body.userId){
            let user = await mongodb.unfollowArtist(req.body.userId,req.body.artistId)
            if(user){
                resp.status(201).json(user)
            }
            else{
                resp.status(401).json(user)
            }
            // } else {
            //     resp.status(401).json({error: "Unauthorized"})
            // }
        }catch(error){
            resp.status(500).json({error})
        }
    }else{
        resp.status(400).json({error: "Bad request"})
    }
})


module.exports = user;
