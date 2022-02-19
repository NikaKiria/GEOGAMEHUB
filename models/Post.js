const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    likes: {
        type: Array,
        required: true,
    },
    comments: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model("Post", PostSchema);