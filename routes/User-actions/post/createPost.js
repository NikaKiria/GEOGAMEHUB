const express = require('express');
const Post = require('../../../models/Post.js');
const auth = require('../../../middlewares/auth.js');
const joi = require('joi');
const router = express.Router();
const User = require('../../../models/User.js');
const escape = require('escape-html');
 
// Schema to validate new post info
const newPostSchema = joi.object().keys({
    title: joi.string()
        .min(3)
        .max(50)
        .required(),
    content: joi.string()
        .min(3)
        .max(700)
        .required(),
    author: joi.string()
        .min(3)
        .max(30)
        .required(),
    authoremail: joi.string()
        .required()
        .email(),
    date: joi.date(),
    likes: joi.number()
        .integer(),
    comments: joi.array()
});

// Escape HTMl
const escapeHTML = (postObject) => {
    postObject.title = escape(postObject.title);
    postObject.content = escape(postObject.content);
    return postObject;
};

// Assign username and date
const assignUserAndDate = (cleanPostData, authorUser) => {
    cleanPostData.author = authorUser.username;
    cleanPostData.authoremail = authorUser.email;
    currentDate = new Date();
    cleanPostData.date = currentDate.toDateString();
};

// Create new post
router.post('/createpost', auth, async (req,res) => {
    try{
        const postRawData = await req.body;
        // Escape HTML tags
        const cleanPostData = escapeHTML(postRawData);
        // Find user by email ( given by auth middleware )
        const authorUser = await User.findOne({email:req.user});
        if(!authorUser){
            return res.status(404).json("User not found!");
        }
        // Assign author to username and date to current date
        assignUserAndDate(cleanPostData, authorUser);
        // Validate cleanPostData (post data that will be saved to db)
        const validatedData = newPostSchema.validate(cleanPostData);
        if(validatedData.error){
            return res.status(400).json({"validation":validatedData.error});
        }
        // Create new post
        const newPost = await new Post(cleanPostData);
        newPost.save();
        res.status(201).json("Post successfully created!");
    }catch(err) {
        console.log(err);
        res.status(500).json("Server Error!");
    }
});

module.exports = router;