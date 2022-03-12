const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/env/.env`});
const {connectToDB} = require('./database/database.js');
// Import routes
const registerRoute = require('./routes/User-authorization/register.js');
const loginRoute = require('./routes/User-authorization/login.js');
const newsFeedRoute = require('./routes/Feed/newsfeed.js');
const createpostRoute = require('./routes/User-actions/post/createPost.js');
const likePost = require('./routes/User-actions/like/likePost.js');
const commentPost = require('./routes/User-actions/comment/comment.js');
const deleteComment = require('./routes/User-actions/comment/deleteComment.js');
const deletePostRoute = require('./routes/User-actions/post/deletePost.js');
// Create express app
const app = express();

// Use BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to database
connectToDB(process.env.MONGO_URI);

// Routes
app.use('/api/v1', registerRoute);
app.use('/api/v1', loginRoute);
app.use('/api/v1', createpostRoute);
app.use('/api/v1', newsFeedRoute);
app.use('/api/v1', likePost);
app.use('/api/v1', commentPost);
app.use('/api/v1', deletePostRoute);
app.use('/api/v1', deleteComment);

// Listen to port
let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
});