const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/Post.js');
const joi = require('joi');
const auth = require('../middlewares/auth.js');
const escape = require('escape-html');

// Schema to validate new post info
const commentSchema = joi.string().max(700).required();

// Validate comment content
const validateComment = (cleanCommentContent) => {
    const validatedComment = commentSchema.validate(cleanCommentContent);
    if(validatedComment.error){
        console.log(validatedComment.error);
        return res.status(400).json("Comment cant be added!");
    }
};

// Push new comments
const  pushComment = (postToComment, cleanCommentContent, req) => {
    postToComment.comments.push(
        {
            content: cleanCommentContent,
            author: req.user
        }
    );
    return postToComment;
};

router.put('/comment/:id', auth, async (req,res) => {
    const rawPostID = req.params.id;
    // Escape HTML
    const postID = escape(rawPostID);
    // Get Post
    const postToComment = await Post.findById(
        postID,
        err => console.log(err)
    ).clone();
    // Return error if post doesnt exist
    if(!postToComment){
        return res.status(404).json("Post not found!");
    }
    // Escape html
    const cleanCommentContent = escape(req.body.content);
    // Validate comment
    validateComment(cleanCommentContent);
    // Comment to post
    pushComment(postToComment, cleanCommentContent, req);
    postToComment.save();
    return res.status(200).json("Post Successfully Commented!");
});

module.exports = router;