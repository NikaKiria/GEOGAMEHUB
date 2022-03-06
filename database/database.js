const mongoose = require('mongoose');

// Connect to Database
const connectToDB = (MONGO_URI) => {
    mongoose.connect(MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        (err) => {
            if(err){
                throw err;
            }else{
                console.log("connected to database");
            }
        }
    );
};

module.exports = {
    connectToDB: connectToDB
};