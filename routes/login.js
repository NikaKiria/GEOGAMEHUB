require('dotenv').config({path: `${__dirname}/env/.env`});
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User.js');

// Schema to validate user info
const newUserSchema = joi.object().keys({
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});

// Generate access token
const generateAccessToken = (email, secretToken) => {
    return jwt.sign({email}, secretToken , {expiresIn: "1d"});
};

// Return access token and user info
const sendAccesstokenAndUserInfo = (userObject, secretToken, userExist, res) => {
    const accessToken = generateAccessToken(userObject.email, process.env.JWT_TOKEN_SECRET);
    if(!accessToken){
        return res.status(500).json("Server Error!");
    }
    return res.status(200).json({accessToken, user:{
        id: userExist._id,
        username: userExist.username,
        age: userExist.age,
        email: userExist.email
    }});
};

router.post('/login', async (req,res) => {
    // Validate user object
    const userObject = req.body;
    const validationResult = newUserSchema.validate(userObject);
    if(validationResult.error){
        return res.status(401).json("Wrong Credentials!");
    }
    // Check if user exists
    const userExist = await User.findOne({email: userObject.email});
    if(!userExist){
        return res.status(401).json("Wrong Credentials!");
    }
    // Check if password is correct
    const isMatchPassword = await bcrypt.compare(userObject.password, userExist.password);
    if(isMatchPassword){
        // Return access token
        sendAccesstokenAndUserInfo(
            userObject,
            process.env.JWT_TOKEN_SECRET,
            userExist, 
            res
        );
    }else{
        return res.status(401).json("Wrong Credentials!");
    }
});

module.exports = router;