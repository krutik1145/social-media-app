const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type:String,
        required: true,
        select:false
    },
    name:{
        type:String,
        required:true
    },

    avatar:{
        publicId:String,
        url:String
    },

    bio:{
        type:String,
       
    },

    followers:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
},
 {
    timestamps: true
 }
)

module.exports = mongoose.model('User', userSchema);   