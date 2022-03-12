const express = require('express');
const Post = require('../../../models/Post.js');
const mongoose = require('mongoose');
const auth = require('../../../middlewares/auth.js');
const router = express.Router();

// Delete post
const deletePost = async (req, res, Post) => {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if(!deletedPost){
        return res.status(500).json("Server Error!");
    }
    return res.status(202).json("Post Successfully Deleted");
};

// Check provided objectID
const checkObjectID = (res, postToDeleteID) => {
    const isObjectIDGood = mongoose.Types.ObjectId.isValid(postToDeleteID);
    if(!isObjectIDGood){
        return res.status(400).json("Bad Request!");
    }
};

router.delete('/deletePost/:id', auth, async (req,res) => {
    try{
        const postToDeleteID = req.params.id;
        // Check if id format is good
        const notValidID = await checkObjectID(res, postToDeleteID);
        if(notValidID){
            return notValidID;
        }
        // Get post to delete
        const postToDelete = await Post.findById(postToDeleteID);
        if(!postToDelete){
            return res.status(400).json("Post not found!");
        }
        // Check if author of post is same person requesting to delete it
        if(req.user !== postToDelete.authoremail){
            return res.status(400).json("Bad Request from user!");
        }
        // Delete Post
        deletePost(req, res, Post);
    }catch(err) {
        console.log(err);
        res.status(500).json("Server Error!");
    }
});

module.exports = router;