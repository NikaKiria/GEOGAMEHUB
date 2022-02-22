const jwt = require('jsonwebtoken');

const auth = (req,res,next) => {
    try{
        // Checking if token exists
        const token = req.header("x-auth-token");
        if(!token){
            return res.status(401).json("Authorisation Denied!");
        }
        // Verifying Token
        const verified = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        if(!verified){
            return res.status(401).json("Authorisation Denied!");
        }
        req.user = verified.email;
        next();
    }catch(err) {
        res.status(500).json("Something went wrong!");
    }
};

module.exports = auth;