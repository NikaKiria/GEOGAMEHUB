const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const joi = require('joi');
const User = require('../models/User.js');
const router = express.Router();

// Schema for validation new user info
const newUserSchema = joi.object().keys({
    username: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    age: joi.number()
        .integer()
        .min(16)
        .max(100),
    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeat_password: joi.ref('password'),
});

// Post request to register user
router.post('/register', async (req,res) => {
    try{
        // Validate User info
        const newUserInfo = await req.body;
        const validatedInfo = newUserSchema.validate(newUserInfo);
        if(validatedInfo.error){
            return res.status(400).json({"Validator error":validatedInfo.error});
        }
        // Check if user already exist
        const alreadyRegistered = await User.findOne({username: newUserInfo.username});
        if(alreadyRegistered){
            console.log("User is already  registered I swear");
            return res.status(409).json("User Already Registered");
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        newUserInfo.password = await bcrypt.hash(newUserInfo.password, salt);
        newUserInfo.repeat_password =  await bcrypt.hash(newUserInfo.repeat_password, salt);
        // Create new user
        const newUser = await new User(newUserInfo);
        newUser.save((err) => {
            if(err){
                return res.status(500).json("Server Error!");
            }else{
                return res.status(201).json("User Registered!");
            }
        });
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;