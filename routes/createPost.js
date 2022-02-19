const express = require('express');
const Post = require('../models/Post.js');
const auth = require('../middlewares/auth.js');
const joi = require('joi');
const router = express.Router();
const User = require('../models/User.js');

// Schema to validate new post info
const newPostSchema = joi.object().keys({
    title: joi.string()
        .min(3)
        .max(30)
        .required(),
    content: joi.string()
        .min(3)
        .max(700)
        .required(),
    author: joi.string()
        .min(3)
        .max(30)
        .required(),
    date: joi.date(),
    likes: joi.number()
        .integer(),
    comments: joi.array()
});

// Create new post
router.post('/createpost', auth, async (req,res) => {
    // Validate post data provided by user
    const postRawData = await req.body;
    // Find user by email ( given by auth middleware )
    const authorUser = await User.findOne({email:req.user});
    if(!authorUser){
        return res.status(404).json("User not found!");
    }
    postRawData.author = authorUser.username;
    currentDate = new Date();
    postRawData.date = currentDate.toDateString();
    const validatedData = newPostSchema.validate(postRawData);
    if(validatedData.error){
        return res.status(400).json({"validation":validatedData.error});
    }
    // Create new post
    const newPost = await new Post(postRawData);
    newPost.save();
    res.status(201).json("Post successfully created!");
});

module.exports = router;