const express = require('express');
const router = express.Router();
const Post = require('../models/Post.js');
const joi = require('joi');
const auth = require('../middlewares/auth.js');
const escape = require('escape-html');

// Schema to validate new post info
const commentSchema = joi.string().max(700).required();

router.put('/comment/:id', auth, async (req,res) => {
    // Get post
    const postID = req.params.id;
    const postToComment = await Post.findById(postID);
    if(!postToComment){
        return res.status(404).json("Post not found!");
    }
    // Validate comment
    const validatedComment = commentSchema.validate(req.body.content);
    if(validatedComment.error){
        console.log(validatedComment.error);
        return res.status(400).json("Comment cant be added!");
    }
    // Escape html
    const cleanCommentContent = escape(req.body.content);
    // Comment to post
    postToComment.comments.push(
        {
        content: cleanCommentContent,
        author: req.user
        }
    );
    postToComment.save();
    return res.status(200).json("Post Successfully Commented!");
});

module.exports = router;