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
    }, secret, {
        'expiresIn': expiry // w for weeks, m for minutes, s for seconds
    });
}

router.post('/login', async (req, res) => {
    let user = await User.where({
        'email': req.body.email
    }).fetch({
        require: false
    });

    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        let accessToken = generateAccessToken(user.toJSON(), process.env.TOKEN_SECRET, "30m");
        let refreshToken = generateAccessToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, "7d");
        res.send({
            'accessToken': accessToken,
            'refreshToken': refreshToken,
            'user': user
        })
    } else {
        res.status(500),
            res.send({
                'error': "Wrong email or password"
            })
    }
})

router.post('/register', async (req, res) => {

    if (req.body.password !== req.body.confirmPassword) {
        res.send("Passwords do not match");
    }

    // Check if email is already in use
    let checkEmail = await User.where({
        'email': req.body.email
    }).fetch({
        require: false
    })
    if (checkEmail) {
        res.send('Email in use')
    } else {
        try {
            // Add user into table
            const user = new User()
            user.set('username', req.body.username)
            user.set('first_name', req.body.first_name)
            user.set('last_name', req.body.last_name)
            user.set('email', req.body.email)
            user.set('password', getHashedPassword(req.body.password))
            user.set('address', req.body.address)
            user.set('contact', req.body.contact)
            user.set('birth_date', req.body.birthdate)
            user.set('role', 'Customer')
            user.set('created', new Date())
            await user.save()

            res.send(user)
        } catch (e) {
            console.log(e)
            res.send('Unable to create user')
        }
    }
})

router.post('/refresh', async function (req, res) {
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
            'message': "The refresh token has already expired."
        })
    }


    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, payload) {
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

router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    try {
        let user = req.user

        let getUser = await User.where({
            'id': user.id
        }).fetch({
            require: false
        });

        console.log(user)
        console.log(getUser)
        res.send({
            user: getUser,
            message: 'Welcome, ' + req.user.username
        });
    } catch (e) {
        console.log(e)
    }
})


router.post('/logout', async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            async function (err, payload) {
                if (err) {
                    return res.sendStatus(401);
                }
                const token = new BlacklistedToken();
                token.set('token', refreshToken);
                token.set('date_created', new Date())
                await token.save();
                res.send({
                    'message': "logged out"
                })
            })
    }
})

router.patch('/update/:user_id', async (req, res) => {

    let id = req.params.user_id
    let user = await User.where({
        "id": id
    }).fetch({
        require: true
    })

    try {
        // Edit user info table
        user.set('first_name', req.body.first_name)
        user.set('last_name', req.body.last_name)
        user.set('address', req.body.address)
        user.set('contact', req.body.contact)
        user.set('birth_date', req.body.birth_date)
        await user.save()
        res.send(user)
    } catch (e) {
        console.log(e)
        res.send('Unable to update user')
    }


})

module.exports = router