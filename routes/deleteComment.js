const express = require('express');
const Post = require('../models/Post.js');
const auth = require('../middlewares/auth.js');
const mongoose = require('mongoose');

const router = express.Router();

// Check provided Post ID
const checkPostID = (res, postID) => {
    const isPostIDGood = mongoose.Types.ObjectId.isValid(postID);
    if(!isPostIDGood){
        return res.status(400).json("Bad Request!");
    }
};

// Check if user requesting delete is author of comment
const checkIfAuthor = async (req, commentsArray, commentID) => {
    let ErrorsArray = [];
    commentsArray.map((commentObj) => {
        if(commentObj.id === commentID && commentObj.author !== req.user){
            console.log(commentObj);
            ErrorsArray.push(commentObj.id);
        }
    });
    return ErrorsArray;
};

router.put('/deleteComment/:postId/:commentId', auth, async (req,res) => {
    try{
        const postID = req.params.postId;
        const commentID = req.params.commentId;
        // Check provided postID (mongodb objectID)
        const idNotValid = await checkPostID(res, postID);
        if(idNotValid){
            return idNotValid;
        }
        // Get post
        const parentPost = await Post.findById(postID);
        if(!parentPost){
            return res.status(400).json("Post not found!");
        }
        // Check if user requesting to delete comment is author
        const commentsArray = parentPost.comments;
        const checkAuthor = await checkIfAuthor(req, commentsArray, commentID);
        console.log(checkAuthor);
        if(checkAuthor.length > 0){
            return res.status(400).json("Bad request!");
        }
        // Create new comments array which do not include comment with provided ID
        const newcommentsArray = [];
        commentsArray.forEach(commentObject => {
            if(commentObject.id != commentID){
                newcommentsArray.push(commentObject);
            }
        });
        // Update parent post object
        const updatedParentPost = await Post.findOneAndUpdate({_id: postID},{comments: newcommentsArray},{
            returnOriginal: false
        });
        if(!updatedParentPost){
            return res.status(500).json("Server error!");
        }
        const savedParentPost = await updatedParentPost.save();
        if(savedParentPost){
            return res.status(200).json("Comment successfully deleted!");
        }
    }catch(err) {
        console.log(err);
        res.status(500).json("Something went wrong!");
    }
});

module.exports = router;