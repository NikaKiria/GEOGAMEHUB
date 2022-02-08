const mongoose = require('mongoose');

// Connect to Database
const connectToDB = (MONGO_URI) => {
    mongoose.connect(MONGO_URI, () => {
        console.log("connected to database");
    });
};


module.exports = {
    connectToDB: connectToDB
};