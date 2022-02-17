const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/env/.env`});
const {connectToDB} = require('./database/database.js');
// Import routes
const registerRoute = require('./routes/register.js');
const loginRoute = require('./routes/login.js');
const newsFeedRoute = require('./routes/newsfeed.js');
const createpostRoute = require('./routes/createPost.js');

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

// Listen to port
const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`Listening to port: ${PORT}`);
});