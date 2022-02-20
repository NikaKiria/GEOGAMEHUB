const express = require('express');
const router = express.Router();
const Post = require('../models/Post.js');
const auth = require('../middlewares/auth.js');

router.put('/comment/:id', auth, async (req,res) => {
    // Get post
    const postID = req.params.id;
    const postToComment = await Post.findById(postID);
    if(!postToComment){
        return res.status(404).json("Post not found!");
    }
    // Check if comment text exist
    if(!req.body.comment){
        return res.status(400).json("Bad Request!");
    }
    // Comment to post
    postToComment.comments.push(
        {
        content:req.body.comment,
        author: req.user
        }
    );
    postToComment.save();
    return res.status(200).json("Post Successfully Commented!");
});

module.exports = router;