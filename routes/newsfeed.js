const express = require('express');
const auth = require('../middlewares/auth.js');
const Post = require('../models/Post.js');
const router = express.Router();

// Get Posts for newsfeed
router.get('/posts', auth, async (req,res) => {
    try{
        const posts = await Post.find().limit(100);
        if(posts){
            res.status(200).json(posts);
        }else{
            res.status(404).json("Cant get posts");
        }
    }catch(err) {
        console.log(err);
    }
});

module.exports = router;