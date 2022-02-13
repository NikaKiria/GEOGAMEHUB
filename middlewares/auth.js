const jwt = require('jsonwebtoken');

const generateAccessToken = (email, secretToken) => {
    return jwt.sign({email}, secretToken , {expiresIn: "1d"});
};

module.exports = generateAccessToken;
  