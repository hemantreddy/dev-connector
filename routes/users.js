const express = require('express');
const router = express.Router(); 
const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');

//route /users/register

router.post('/register', (req, res) => {
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
                        .catch(err => res.json(err));
                }); 
            });

        })
        .catch(err => console.log(err)); 
});

module.exports = router; 