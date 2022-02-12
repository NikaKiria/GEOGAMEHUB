const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const joi = require('joi');
const User = require('../models/User.js');
const router = express.Router();

// Schema for validation new user info
const newUserSchema = joi.object({
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
        const newUserInfo = await req.body;
        const validatedInfo = newUserSchema.validate(newUserInfo);
        if(validatedInfo.error){
            console.log(validatedInfo.error);
            res.status(400).json({"vaidator error":validatedInfo.error});
        }
        //FIXME: Check if user already exist and register
    } catch(err) {
        console.log(err);
    }

});

module.exports = router;