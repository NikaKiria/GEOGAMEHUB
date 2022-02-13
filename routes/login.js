require('dotenv').config({path: `${__dirname}/env/.env`});
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const router = express.Router();
const generateAccessToken = require('../middlewares/auth.js');
const User = require('../models/User.js');

// Schema to validate user info
const newUserSchema = joi.object().keys({
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});

router.post('/login', (req,res) => {
    // Validate user object
    const userObject = req.body;
    const validationResult = newUserSchema.validate(userObject);
    if(validationResult.error){
        return res.status(401).json("Wrong Credentials!");
    }
    // Check if user exists
    const userExist = User.findOne({email: userObject.email});
    if(!userExist){
        return res.status(401).json("Wrong Credentials!");
    }
    // Return access token
    const accessToken = generateAccessToken(userObject.email, process.env.JWT_TOKEN_SECRET);
    res.status(200).json({accessToken});
});

module.exports = router;