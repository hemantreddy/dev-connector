const express = require('express'); 
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//profile model
const Profile = require('../models/Profile');

//post model
const Post = require('../models/Posts');

//validation
const validatePostInput = require('../validation/posts'); 


//test route
router.get('/test',(req, res) => {
    res.send('test');
});

//all posts

router.get('/', (req, res) => {
    Post.find()
        .sort({date : -1})
        .then(posts => {
            if(posts.length == 0){
                res.status(400).json({noposts : "no posts yet"});
            }
            res.status(200).json(posts);
        })
        .catch(err => res.status(400).json({noposts : "no posts yet"}));
});


//get posts by ID (public route)

router.get('/:id', (req, res) => {
    Post.findById({_id : req.params.id})
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => res.status(400).json({error : 'no post with this id'}))
});

//create new post (private)

router.post('/', passport.authenticate('jwt', {session : false}), (req, res) => {

    const {errors , isValid} = validatePostInput(req.body); 
    if(!isValid) {
        res.status(400).json(errors); 
    }
    const newPost = new Post({
        text : req.body.text,
        name : req.body.name,
        avatar : req.body.avatar,
        user : req.user.id,
    });

    newPost.save().then(post => res.status(200).json(post));
});

//delete post by ID (private)

router.delete('/:id', passport.authenticate('jwt', {session : false}), (req, res) => {
   Post.findById({_id : req.params.id})
    .then(post => {
        if(post.user.toString() !== req.user.id){
            return res.status(400).error({unauthorized :"User not authorized"});
        }

        post.remove().then(() => res.status(200).json({message : 'post deleted successfully'}));
    })
    .catch(err => res.status(400).json(err)); 
})

//like post (private)

router.post('/like/:id', passport.authenticate('jwt', {session : false}),(req, res) => {
    Profile.findOne({user : req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.id.toString() === req.user.id).length > 0){
                        return res.status(400).json({alreadyliked : 'user has already liked this post'})
                    }

                    post.likes.unshift({user : req.user.id});
                    post.save().then(res.status(200).json(post));
                })
                .catch(err => res.status(400).json({postnotfound : 'post not found'}))
        });
});

//unlike post (private)

router.post('/unlike/:id', passport.authenticate('jwt', {session : false}), (req, res) => {
    Profile.findOne({user : req.user.id})
        .then(profile => {
            Post.findOne({user : req.user.id})
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                        res.status(400).json({notlikedyet : 'you have not liked the post yet'});
                    }

                   const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
                   post.likes.splice(removeIndex, 1); 
                   post.save().then(() => res.status(200).json(post))
                })
                .catch(err => res.status(400).json(err)); 
        });
});

//add comment to post

router.post('/comment/:id', passport.authenticate('jwt', {session : false}), (req, res) => {
    const {error, isValid} = validatePostInput(req.body)
    if(!isValid) {
        res.status(400).json(error)
    }

    Post.findById({_id : req.params.id})
        .then(post => {
            const newComment = {
                name : req.body.name,
                text : req.body.text,
                avatar : req.body.avatar,
                user : req.user.id
            }

            post.comments.unshift(newComment);
            post.save().then(post => res.status(200).json(post)); 
        })
});

//delete comment //comment':id (private)

router.delete('/comment/:id/:commentId', passport.authenticate('jwt',{session: false}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if(post.comments.filter(comment => comment._id.toString() === req.params.commentId).length === 0){
                return res.status(404).json({commentnotfound : 'comment not found'})
            }

            const removeIndex = post.comments.map(comment => comment._id.toString()).indexOf(req.params.commentId);
            post.comments.splice(removeIndex, 1);
            post.save()
                .then(post => res.status(200).json(post)); 
            })
            .catch(err => res.status(400).json({error : 'no comment found'}))
})

module.exports = router;