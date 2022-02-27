const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const joi = require('joi');
const router = express.Router();
const User = require('../models/User.js');
const escape = require('escape-html');

// Schema to validate new user info
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

// Escape HTMl
const escapeHTML = (postObject) => {
    postObject.username = escape(postObject.username);
    postObject.email = escape(postObject.email);
    postObject.age = escape(postObject.age);
    postObject.password = escape(postObject.password);
    postObject.repeat_password = escape(postObject.repeat_password);
    return postObject;
};

// Hash password
const hashPassword = async (newUserInfo) => {
    const salt = await bcrypt.genSalt(10);
    newUserInfo.password = await bcrypt.hash(newUserInfo.password, salt);
    newUserInfo.repeat_password =  await bcrypt.hash(newUserInfo.repeat_password, salt);
};

// Post request to register user
router.post('/register', async (req,res) => {
    try{
        // Get user object
        const newUserRawInfo = await req.body;
        // Escape HTML
        const newUserInfo = escapeHTML(newUserRawInfo);
        // Validate provided info
        const validatedInfo = newUserSchema.validate(newUserInfo);
        if(validatedInfo.error){
            return res.status(400).json({"Validator error":validatedInfo.error.message});
        }
        // Check if user already exist
        const alreadyRegistered = await User.findOne({username: newUserInfo.username});
        if(alreadyRegistered){
            return res.status(409).json("User Already Registered");
        }
        // Hash password
        hashPassword(newUserInfo);
        // Create new user
        const newUser = await new User(newUserInfo);
        newUser.save((err) => {
            if(err){
                return res.status(500).json("Wrong Credentials!");
            }else{
                return res.status(201).json("User Registered!");
            }
        });
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;