const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const { error, success } = require('../utlis/ResponseWrapper');


 // intrnal function 
 
    

const signupController = async(req, res) => {
    try {
      const { name, email, password} = req.body;

      if(!email || !password  || !name){
        // return res.status(400).send('all fields are required')
        return res.send(error(400, 'all field are required'))
      }

      const olduser = await User.findOne({email});
      if(olduser){
        // res.status(409).send('same email registered')/
         return res.send(error(400, 'user already registered'))
      }

      const hashedPassword = await bcrypt.hash(password, 10);
       
    const user = await User.create({
        email,
        password: hashedPassword,
        name,
    });
      const newUser = await User.findById(user._id)
    return res.send(success(201, {
        user,
    }))


    } 
        catch (e) {
        return res.send(error(500, e.message));
    } 
};





const loginController = async(req, res) => {
    try {
       const { email, password} = req.body;

      if(!email || !password){
        // return res.status(400).send('all fields are required')
         return res.send(error(400, 'all field are required'))
      }

      const user = await User.findOne({email}).select('+password');
      if(!user){
        // res.status(404).send('user not registered ')
         return res.send(error(404, 'user  not registered'))
      }

      const matched = await bcrypt.compare(password, user.password);
      if(!matched){
        // return res.status(403).send('incorrect password');
         return res.send(error(403, 'incorret password'))
      }

 
      const refreshToken = generateRefreshToken({
            _id:user._id,
        });
    


      const accessToken = generateAccessToken({
        _id:user._id, 
       
        });
     
       res.cookie('jwt',refreshToken,{
        httpOnly: true,
        // secure: true,
        //   sameSite: 'None'
      secure: process.env.NODE_ENV === 'production',  // ✅ only true on deployment
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',  // ✅ safe on localhost


       });

      return res.send(success(201,{
        accessToken,

      }))


      
    }
    

    
      
    catch (error) {  
        console.log(error);
    }
 
   
  
};

const logoutController = async (req,res) =>{
try {
  res.clearCookie('jwt',{
    httpOnly: true, 
    secure:true,
  })
  return res.send(success(200,'user logged out' ))
} catch (e) {
  return res.send(error(500, e.message));
}
}

const generateAccessToken = (data) => {
            const token =  jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
                expiresIn: "1d",
            });
        // console.log(token);
         return token;
    };

    const generateRefreshToken = (data) => {
        // try {
             const token =  jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
            expiresIn: "1y",
             });
              // console.log(token);
         return token;
    

      
        
            //  ;
            
        // } catch (error) {
        //    console.log(error); 
        // }
};

// this api will check refresh token availablity and alot you the new access token 
    const refreshAccessTokenController = async(req,res) => {
      const cookies = req.cookies;
        if(!cookies.jwt){
        //  return res.status(401).send("refresh token in cookie is  required");
         return res.send(error(401, 'refresh token in cookie  are required'))
        }
        const refreshToken = cookies.jwt

        console.log('refreshh ', refreshToken);

        // if(!refreshToken){
        //     // return res.status(401).send('refresh token is required')
        //      return res.send(error(401, 'refresh token are required'))
        // }

        try {
                    const decoded = jwt.verify(
                        refreshToken,
                        process.env.REFRESH_TOKEN_PRIVATE_KEY
                    );
               
                const _id = decoded._id;
                const accessToken = generateAccessToken({_id});

                return res.send(success(201, {
                    accessToken,
                }))
                 }
                
                catch (e) {
                    console.log(e);
                    return res.send("invalid refresh token")
                }
    }   
  
module.exports= {
    signupController,
    loginController,
    refreshAccessTokenController,
    logoutController
    
};