const jwt = require('jsonwebtoken')
const fs = require('fs')

function createToken (value){
    let privateKey = fs.readFileSync('private.key')
    return jwt.sign(value,privateKey,{'algorithm': 'RS256','expiresIn':'24h'})
}

function getToken(token){
    const publicKey = fs.readFileSync('public.key')
    return jwt.verify(token,publicKey)
}

module.exports= {
    createToken,
    getToken
}