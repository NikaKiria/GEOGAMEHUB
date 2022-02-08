const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/env/.env`});
const express = require('express');
const {connectToDB} = require('./database/database.js');

// Create express app
const app = express();

// Connect to database
connectToDB(process.env.MONGO_URI);

// Listen to port
const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`Listening to port: ${PORT}`);
});