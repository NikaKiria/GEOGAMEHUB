const express = require('express');
const router = express.Router();
const Post = require('../models/Post.js');
const auth = require('../middlewares/auth.js');

router.put('/likePost/:id', auth, async (req,res) => {
    // Get post
    const postID = req.params.id;
    const postToLike = await Post.findById(postID);
    if(!postToLike){
        return res.status(404).json("Post not found!");
    }
    // Unlike Post if user already liked it
    if(postToLike.likes.includes(req.user)){
        const indexOfUserInLikes = postToLike.likes.indexOf(req.user);
        postToLike.likes.splice(indexOfUserInLikes,1);
        console.log(postToLike.likes);
        postToLike.save();
        return res.status(200).json("Post Unliked!");
    }
    // Like Post
    postToLike.likes.push(req.user);
    postToLike.save();
    return res.status(200).json("Post Successfully liked!");
});

module.exports = router;