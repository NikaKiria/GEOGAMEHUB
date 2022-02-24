const express = require('express');
const router = express.Router();
const Post = require('../models/Post.js');
const auth = require('../middlewares/auth.js');

// Unlike Post ( Check if user has already liked post and unlike it )
const unlikePost = async (postToLike, req, res) => {
    const indexOfUserInLikes = postToLike.likes.indexOf(req.user);
    postToLike.likes.splice(indexOfUserInLikes,1);
    await postToLike.save();
    return res.status(200).json("Post Unliked!");
};

// Like post
const likePost = async (postToLike, postID, req, res) => {
    const LikesArray = postToLike.likes;
    LikesArray.push(req.user);
    const likedPost = await Post.findOneAndUpdate({_id: postID},{likes: LikesArray},{
        returnOriginal: false
    });
    return res.status(200).json("Post Successfully liked!");
};

// Route to like and unlike posts
router.put('/likePost/:id', auth, async (req,res) => {
    // Get post
    const postID = req.params.id;
    const postToLike = await Post.findById(
        postID, 
        err => err && console.log(err)
    ).clone();
    // Check if post exist
    if(!postToLike) {
        return res.status(404).json("Post not found!");
    }
    if(postToLike.likes.includes(req.user)) {
        // Unlike Post if user already liked it
        unlikePost(postToLike, req, res);
    }else {
        // Like Post
        likePost(postToLike, postID, req, res);
    }
});

module.exports = router;