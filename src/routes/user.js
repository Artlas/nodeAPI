const express = require('express');
const mongodb = require('../Database/userDB');
const jwt = require('../auth/jwt');
const multer = require('multer');
const upload = multer();
const user = express.Router();

/**
 * @useage : connect a use to get a token for authentication
 * @param mail in body: mail de l'utilisateur à connecter (si id est null)
 * @param id in body: id de l'utilisateur à connecter (si mail est null)
 * @param password in body: mot de passe de l'utilisateur à connecter
 */
user.post('/connect', async (req, resp) => {
    if ((req.body.mail != null || req.body.id != null) && req.body.password != null) {
        try {
            let user = await mongodb.checkUser(req.body.mail, req.body.id, req.body.password);
            if (user.mail != null) {
                let token = jwt.createToken({ userdata: { id: user.id, permission: user.permission } });
                let newuser = {
                    token: token,
                    id: user.id,
                    mail: user.mail,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    birthdate: user.birthdate,
                    address: user.address,
                    image: user.image,
                    permission: user.permission,
                    friends: user.friends,
                    gallery: user.gallery,
                    lists: user.lists,
                    likedPosts: user.likedPosts,
                    favoritCat: user.favoritCat,
                };
                resp.status(201).json(newuser);
            } else {
                resp.status(401).json(newuser);
            }
        } catch (error) {
            console.log(error);
            resp.status(500).send(error);
        }
    } else {
        resp.status(400).json({ error: 'Bad request' });
    }
});

/**
 * @useage : Update d'un mot de passe
 * @param token in headers: token de l'utilisateur connecté
 * @param mail in body: mail de l'utilisateur à connecter (si id est null)
 * @param password in body: mot de passe actuel de l'utilisateur
 * @param newPassword in body: nouveau mot de passe de l'utilisateur
 */
user.put('/updatePassword', async (req, resp) => {
    if (req.body.mail != null && req.body.password != null && req.body.newPassword != null) {
        try {
            let value = jwt.getToken(req.headers.token);
            if (value.userdata.permission == 'admin' || value.userdata.mail == req.body.mail) {
                let user = await mongodb.updatePassword(req.body.mail, req.body.password, req.body.newPassword, value.userdata.permission);
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

/**
 * @useage : check if user exists
 * @param token in headers: token de l'utilisateur connecté
 * @param mail in body: mail de l'utilisateur à connecter (si id est null)
 * @param id in body: id de l'utilisateur à connecter (si mail est null)
 */
user.post('/check', async (req, resp) => {
    if (req.body.mail != null || req.body.id != null) {
        try {
            let response = await mongodb.checkUserExists(req.body.mail, req.body.id);
            if (response.userExists) {
                resp.status(200).json({ message: 'User exists' });
            } else {
                resp.status(201).json({ message: 'User not found' });
            }
        } catch (error) {
            console.log(error);
            resp.status(500).send({ error: 'Internal server error', details: error });
        }
    } else {
        resp.status(400).json({ error: 'Bad request' });
    }
});

/**
 * @useage : ajout d'un utilisateur
 * @param mail in body: mail de l'utilisateur à crée
 * @param id in body: id de l'utilisateur à crée
 * @param password in body: mot de passe de l'utilisateur à crée
 * @param firstName in body: prénom de l'utilisateur à crée
 * @param lastName in body: nom de l'utilisateur à crée
 * @param birthdate in body: date de naissance de l'utilisateur à crée
 * @param address in body: adresse de l'utilisateur à crée
 * @param image in body: image de l'utilisateur à crée
 */
user.post('/add', upload.single('image'), async (req, resp) => {
    console.log(req.body);
    console.log(req.file);
    if (
        req.body.id != null &&
        req.body.mail != null &&
        req.body.password != null &&
        req.body.firstName != null &&
        req.body.lastName != null &&
        req.body.birthdate != null &&
        req.body.address != null &&
        req.file != null &&
        req.body.favoritCat != null
    ) {
        try {
            let user = await mongodb.createUser(
                req.body.id,
                req.body.mail,
                req.body.password,
                req.body.firstName,
                req.body.lastName,
                req.body.birthdate,
                req.body.address,
                req.file,
                req.body.favoritCat
            );
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
/**
 * @useage : modification d'un utilisateur
 * @param id in body: id de l'utilisateur à modifier
 * @param mail in body: mail de l'utilisateur à modifier
 * @param password in body: mot de passe de l'utilisateur à modifier
 * @param password in query : nouveau mot de passe si modification du mot de passe
 * @param firstName in body: prénom de l'utilisateur à modifier
 * @param lastName in body: nom de l'utilisateur à modifier
 * @param birthdate in body: date de naissance de l'utilisateur à modifier
 * @param address in body: adresse de l'utilisateur à modifier
 * @param image in body: image de l'utilisateur à modifier
 */
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

/**
 * @useage : suppression d'un utilisateur
 * @param mail in body: mail de l'utilisateur à supprimer
 * @param password in body: mot de passe de l'utilisateur à supprimer
 * @param id in body: id de l'utilisateur à supprimer
 * @param token in headers: token de l'utilisateur connecté
 */
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

/**
 * @useage : récupération des folowers d'un utilisateur
 * @param id in body: id de l'utilisateur à récupérer
 * @param token in headers: token de l'utilisateur connecté
 */
user.post('/getUserFolowers', async (req, resp) => {
    if (req.body.id != null) {
        try {
            // let value = jwt.getToken(req.headers.token)
            let user = await mongodb.getUserFolowers(req.body.id);
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
/**
 * @useage récupération des folowing d'un utilisateur
 * @param id in body: id de l'utilisateur à récupérer
 * @param token in headers : token de l'utilisateur connecté
 */
user.post('/getUserFolowing', async (req, resp) => {
    if (req.body.id != null) {
        try {
            // let value = jwt.getToken(req.headers.token)
            let user = await mongodb.getUserFolowing(req.body.id);
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

/**
 * @useage : suivre un utilisateur
 * @param userId in body: id de l'utilisateur qui suit
 * @param artistId in body: id de l'artiste à suivre
 * @param token in headers : token de l'utilisateur connecté
 */
user.post('/followArtist', async (req, resp) => {
    if (req.body.userId != null && req.body.artistId != null) {
        try {
            // let value = jwt.getToken(req.headers.token)
            // if(value.userdata.permission == 'admin' || value.userdata.id==req.body.userId){
            let user = await mongodb.followArtist(req.body.userId, req.body.artistId);
            if (user) {
                resp.status(201).json(user);
            } else {
                resp.status(401).json(user);
            }
            // } else {
            //     resp.status(401).json({error: "Unauthorized"})
            // }
        } catch (error) {
            resp.status(500).json({ error });
        }
    } else {
        resp.status(400).json({ error: 'Bad request' });
    }
});

/**
 * @useage : arreter de suivre un utilisateur
 * @param userId in body: id de l'utilisateur qui arrete de suivre
 * @param artistId in body: id de l'artiste a arreter de suivre
 * @param token in headers : token de l'utilisateur connecté
 */
user.post('/unfollowArtist', async (req, resp) => {
    if (req.body.userId != null && req.body.artistId != null) {
        try {
            // let value = jwt.getToken(req.headers.token)
            // if(value.userdata.permission == 'admin' || value.userdata.id==req.body.userId){
            let user = await mongodb.unfollowArtist(req.body.userId, req.body.artistId);
            if (user) {
                resp.status(201).json(user);
            } else {
                resp.status(401).json(user);
            }
            // } else {
            //     resp.status(401).json({error: "Unauthorized"})
            // }
        } catch (error) {
            resp.status(500).json({ error });
        }
    } else {
        resp.status(400).json({ error: 'Bad request' });
    }
});

/**
 * @useage : Des information non confidentielles d'un utilisateur
 * @param id in body: id de l'utilisateur à récupérer
 * @return : les informations non confidentielles de l'utilisateur
 */
user.post('/getUser', async (req, res) => {
    try {
        if (req.body.id != null) {
            let user = await mongodb.getUser(req.body.id);
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(401).json(user);
            }
        } else {
            res.status(400).json({ error: 'Bad request' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
});
/**
 * @useage : récupération de tous les utilisateurs id
 * @param : aucun
 * @return : tous les utilisateurs id
 */
user.post('/getUsersId', async (req, resp) => {
    try {
        let users = await mongodb.getUsersId();
        if (users) {
            resp.status(201).json(users);
        } else {
            resp.status(401).json(users);
        }
    } catch (error) {
        resp.status(500).json({ error });
    }
});

module.exports = user;
