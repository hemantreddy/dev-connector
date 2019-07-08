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
            if(profiles.length == 0){
                errors.noprofile = 'No profiles yet',
                res.status(400).json(errors); 
            }
            res.status(200).json(profiles);
        })
        .catch(err => res.status.json({message : "there are no profiles"})); 
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
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    if(req.body.skills !== undefined) {
        profileFields.skills = req.body.skills.split(',')
    }

    //socials
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;

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

//add experience fields to the user profile
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

//delete experience (private route)
router.delete('/experience/:expId', passport.authenticate('jwt', {session : false}), (req, res) => {
    Profile.findOne({user : req.user.id})
        .then(profile => {

            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.expId);

            profile.experience.splice(removeIndex, 1); 
            profile.save().then(res.status(200).json(profile))
        })
        .catch(err => res.status(400).json(err));      
});

//delete education (private route)
router.delete('/education/:eduId', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {

            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.expId);

            profile.education.splice(removeIndex, 1);
            profile.save().then(res.status(200).json(profile))
        })
        .catch(err => res.status(400).json(err));
});

//delete profile and user (private route)
// @route profile/

router.delete('/', passport.authenticate('jwt', {session : false}), (req, res) => {
    Profile.findOneAndRemove({user : req.user.id}).then(() => {
        User.findOneAndRemove({_id : req.user.id }).then(() => {
            res.status(200).json({success : true})
        });
    });
});



module.exports = router; 