const express  = require('express')
const dotenv = require('dotenv');
const dbConnect = require('./dbConnect');
const AuthRouter = require('./routers/AuthRouter')
const PostRouter = require('./routers/PostRouter')
const userRouter = require('./routers/userRouter')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors')
dotenv.config();
require('dotenv').config();  // change 4
const cloudinary = require('cloudinary').v2;


// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:  process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
   
const app = express();

app.use(express.json({limit:'20mb'}));
app.use(morgan('common')); 
app.use(cookieParser());

app.use(cors({
    credentials: true,
   
     origin: [
        'http://localhost:3000',
        "https://social-media-app-coral-sigma.vercel.app/"],
}));



app.use('/auth', AuthRouter)
app.use("/posts", PostRouter);
app.use("/user", userRouter);

app.get('/', (req,res) => {
   res.status(200).send('ok from server');
})
 

const PORT = process.env.PORT  || 4000;

dbConnect();
app.listen(PORT, () => {
    console.log('listinig of port :', PORT);
});