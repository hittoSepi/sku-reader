var express = require('express');
var router = express.Router();
const User = require('./../controls/user');
const passport = require('passport');
var fs = require('fs');
const TokenGenerator = require('./../auth/token-generator');
const jwt = require('jsonwebtoken');


require.extensions['.pub', '.key'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const secretkey = require('./../jwtRS256.key').toString('base64');
const pubkey = require('./../jwtRS256.pub.key').toString('base64');



const tokenGenerator = new TokenGenerator(secretkey , pubkey, { algorithm: 'HS256', keyid: '1', noTimestamp: false, expiresIn: '15m', notBefore: '2s' })
const refreshGenerator = new TokenGenerator(secretkey , pubkey, { algorithm: 'HS256', keyid: '1', noTimestamp: false, expiresIn: '14d', notBefore: '2s' })


router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    async (req, res, next) => {
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    }
);

/* POST login info */
router.post('/login', async (req, res, next) => {

    passport.authenticate(
        'login',
        async (err, user, info) => {
            try {
				if (err || !user) {
					console.log(err);
					const error = new Error(`User not found.`);
                  return next(error);
               }

                req.login(
                    user,
                    { session: false },
                    async (error) => {
							if (error) return next(error);

						const body = { _id: user._id, email: user.email };

						const accessToken = tokenGenerator.sign(body, { audience: 'lahti.tk', issuer: 'hitto', jwtid: '1', subject: 'user' })
						const refreshToken =refreshGenerator.sign(body, { audience: 'lahti.tk', issuer: 'hitto', jwtid: '1', subject: 'user'})
						user.refreshToken = refreshToken;

                        user.save((err) => {
                            req.login(user, (err) => {
                                if (err) return next(err)
                                return res.send({ accessToken, refreshToken })
                            });
                        });
                        // res.cookie("jwt", accessToken, {secure: true, httpOnly: true})

                    }
                );
            } catch (error) {
                return next(error);
            }
        }
    )(req, res, next);
});


router.post('/token/refresh', (req, res, next) => {
	var token = req.body.token;

	token2 = tokenGenerator.refresh(token, { verify: { audience: 'lahti.tk', issuer: 'hitto' }, jwtid: '1' })

    res.json({
        message: 'Token refreshed',
        token: token2
    })
});




module.exports = router;
