const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const passport = require('passport')
const jwt = require('jsonwebtoken');

const secretOrKey = require('../config/keys').secretOrKey
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

//User model
const User = require('../models/User');


//route /users/register

router.post('/register', (req, res) => {

    const {errors, isValid} = validateRegisterInput(req.body);
    
    if(!isValid) {
        return res.status(400).json(errors); 
    }

    User.findOne({email : req.body.email})
        .then((user) => {
            if(user) {
                res.status(400).json({error : 'user already exists'})
            }

            const avatar = gravatar.url(req.body.email, {
                s : '200',
                r : 'pg',
                d : 'mm'
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash; 
                    newUser.save()
                        .then((user) => {
                            res.status(200).json(user)
                        })
                        .catch(err => res.status(400).json({err : err}));
                }); 
            });

        })
        .catch(err => console.log(err)); 
});

//route /users/login

router.post('/login', (req, res) => {
    console.log(req.body)
    const { errors, isValid } = validateLoginInput(req.body)
    //validation

    if(!isValid){
        return res.status(400).json(errors); 
    }
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email : email})
        .then(user => {
            if(!user) {
                errors.email = "user not found";
                return res.status(400).json(errors);
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        const payload = {id : user.id, name : user.name, avatar : user.avatar}
                        
                        jwt.sign(
                            payload, 
                            secretOrKey,
                            {expiresIn : 3600},
                            (err, token) => {
                                res.json({
                                    success : true,
                                    token : 'Bearer ' + token
                                });
                            }
                        )} 
                        else {
                        errors.password = 'Password Incorrect';
                        return res.status(400).json(errors)
                        }
                });
            
        });
});

//current user

router.get('/current', passport.authenticate('jwt', {session : false}),
    (req, res) => {
        res.json({
            id : req.user.id,
            name : req.user.name,
            email : req.user.email
        });
    }
);

module.exports = router; 