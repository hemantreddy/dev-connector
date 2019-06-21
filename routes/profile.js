const express = require('express')
const router = express.Router();
const passport = require('passport');

//validation 
const validateProfileInput = require('../validation/profile');
const validateEducationInput = require('../validation/education');
const validateExperienceInput = require('../validation/experience');

//user model
const User = require('../models/User');
//profile model
const Profile = require('../models/Profile')

//test route
router.get('/test', (req, res) => {
    res.send('test profile')
});

//get profile of the user (private)

router.get('/', passport.authenticate('jwt', {session : false}), (req, res) => {
    const errors = {};

    Profile.findOne({user : req.user.id})
        .populate('user' ,['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = "There is no profile for this user";
                return res.status(400).json(errors);
            }
            res.json(profile);
        })
        .catch(err => console.log(errors)); 
});

//get all profiles (public route)
router.get('/all', (req, res) => {
    let errors = {};
    Profile.find()
        .populate('users', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles){
                errors.noprofile = 'No profiles yet',
                res.status(400).json(errors); 
            }
            res.status(200).json(profiles);
        })
        .catch(err => console.log(errors)); 
});

//get profile by handle (public)

router.get('/handle/:handle', (req, res) => {

    let errors = {}

    Profile.find({handle : req.params.handle})
        .populate('user', ['name', 'email'])
         .then(profile => {
            if(!profile) {
                errors.noprofile = 'No profile for this handle';
                res.status(400).json(errors)
            }

            res.status(200).json(profile); 
        })
        .catch( err => console.log(errors)); 
});

//get profile by userid

router.get('/user/:user_id', (req, res) => {

    let errors = {}

    Profile.find({
            user: req.params.user_id
        })
        .populate('user', ['name', 'email'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No profile for this user';
                res.status(400).json(errors)
            }

            res.status(200).json(profile);
        })
        .catch(err => console.log(errors));
});

//post profile (private route)
router.post('/', passport.authenticate('jwt', {session : false}), (req, res) => {
    
    const {errors , isValid} = validateProfileInput(req.body);

    if(!isValid){
        return res.status(400).json(errors); 
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    if(req.body.skills !== undefined) {
        profileFields.skills = req.body.skills.split(',')
    }

    //socials
    profileFields.socials = {};
    if(req.body.youtube) profileFields.socials.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.socials.twitter = req.body.twitter;
    if(req.body.instagram) profileFields.socials.instagram = req.body.instagram;
    if(req.body.linkedin) profileFields.socials.linkedin = req.body.linkedin;
    if(req.body.facebook) profileFields.socials.facebook = req.body.facebook;

    Profile.findOne({user : req.user.id})
        .then(profile => {
            if(profile){
                Profile.findOneAndUpdate(
                    {user : req.user.id},
                    {$set : profileFields},
                    {new : true} // what does this do 
                ) .then(profile => {
                    res.json(profile)
                })
            } else {
                Profile.findOne({handle : profileFields.handle})
                    .then(profile => {
                        if(profile){
                            errors.handle = "This handle already exists";
                            res.status(400).json(errors); 
                        }

                        new Profile(profileFields).save()
                            .then(profile => res.json(profile))
                    })
            }
        })
});

//add education fields to the user profile
router.post('/education', passport.authenticate('jwt', {session : false}), (req, res) => {

    const {errors , isValid } = validateEducationInput(req.body)

    if(!isValid){
        return res.status(400).json(errors); 
    }

    Profile.findOne({user : req.user.id})
        .then(profile => {
            const education = {
                school : req.body.school,
                degree : req.body.degree,
                fieldofstudy : req.body.fieldofstudy,
                from : req.body.from,
                to : req.body.to,
                current : req.body.current,
                description : req.body.description,
            };

            profile.education.unshift(education); 

            profile.save().then(profile => res.status(200).json(profile));
        }); 
});

//add education fields to the user profile
router.post('/experience', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateExperienceInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            const experience = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            };

            profile.experience.unshift(experience);

            profile.save().then(profile => res.status(200).json(profile));
        });
});



module.exports = router; 