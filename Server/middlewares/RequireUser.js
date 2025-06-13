const jwt = require('jsonwebtoken');
const { error } = require('../utlis/ResponseWrapper');
const User = require('../models/User');

module.exports = async (req, res , next) => {
    if(!req.headers || 
        !req.headers.authorization || 
        !req.headers.authorization.startsWith("Bearer")){
            // return res.status(401).send('auth header is required');
            return res.send(error(401, 'authorization is required '))
        }

        const accessToken = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_PRIVATE_KEY);
       
        req._id = decoded._id;
        // console.log('inside require user ')
        const user = await User.findById(req._id);
        if(!user){
            return res.send(error(404, 'user not found '));
        }
        next();
         }
        
        catch (e) {
            console.log(e);
            // return res.status(401).send("invalid access key")
            return res.send(error(401, 'invalid access key'))
        } 
        // next();
          
};