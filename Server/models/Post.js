const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    Owner: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    Image:{
        publicId: String,
        url: String
    },

    caption:{
        type: String,
        required: true
    },

    likes: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

   

},
{
    timestamps: true
 })

module.exports= mongoose.model('Post', postSchema);