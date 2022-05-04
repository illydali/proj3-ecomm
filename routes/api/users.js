const express = require('express')
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {
    User,
    BlacklistedToken
} = require('../../models')
const {
    checkIfAuthenticatedJWT
} = require('../../middlewares');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAccessToken = (user, secret, expiry) => {
    // three arguments:
    // arg 1: JWT payload - unique identifier required- aka id
    // anything else u want client to remember eg email, role
    // arg 2: token secret
    // arg 3: configuration expiration object
    return jwt.sign({
        'username': user.username,
        'id': user.id,
        'email': user.email
    }, secret,{
        'expiresIn': expiry // w for weeks, m for minutes, s for seconds
    });
}

router.post('/login', async(req,res)=>{
    let user = await User.where({
        'email': req.body.email
    }).fetch({
        require: false
    });

    if (user && user.get('password') == getHashedPassword(req.body.password)){
        let accessToken = generateAccessToken(user.toJSON(), process.env.TOKEN_SECRET, "15m");
        let refreshToken = generateAccessToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, "1h");
        res.send({
            'accessToken': accessToken,
            'refreshToken': refreshToken
        })
    } else {
        res.status(500),
        res.send({
            'error':"Wrong email or password"
        })
    }
})

router.post('/refresh', async function(req,res){
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    };

    // check if given refresh token has been black listed
    let blacklistedToken = await BlacklistedToken.where({
        'token': refreshToken
    }).fetch({
        require: false
    })

    // if the refresh token has already been blacklisted
    if (blacklistedToken) {
        res.status(401);
        return res.send({
            'message':"The refresh token has already expired."
        })
    }


    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(err,payload){
        if (err) {
            return res.sendStatus(401);
        }
        // create the new access token
        let accessToken = generateAccessToken(payload, process.env.TOKEN_SECRET, '15m');
        res.send({
            accessToken
        })
    })
})

router.get('/profile', checkIfAuthenticatedJWT, (req, res) => {
    const user = req.user;
    res.send({
        user: user,
        message: 'Welcome, ' + req.user.username
    });
})


router.post('/logout', async(req,res)=>{
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            async function(err,payload){
                if (err) {
                    return res.sendStatus(401);
                } 
                const token = new BlacklistedToken();
                token.set('token', refreshToken);
                token.set('date_created', new Date())
                await token.save();
                res.send({
                    'message':"logged out"
                })
            })
    }
})

module.exports = router