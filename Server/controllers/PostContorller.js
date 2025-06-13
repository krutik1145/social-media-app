const Post = require("../models/Post");
// const User = require("../models/User");
const User = require("../models/User");
const { success, error } = require("../utlis/ResponseWrapper");
const cloudinary = require('cloudinary').v2;
const {mapPostOutput} = require('../utlis/Utils')


const createPostController = async (req,res)=>{
   try {
     const {caption , postImg} =  req.body;
     if(!caption || !postImg){
        res.send(error(400, 'caption and postimg is required'))
     }

   const cloudImg = await cloudinary.uploader.upload(postImg,{
         folder:'postImg',
        
       });

    const Owner = req._id;

    const user = await User.findById(req._id);
    
    const post = await Post.create({
       Owner,
       caption,
       Image:{
        publicId: cloudImg.public_id,
        url:cloudImg.url
    }
    });
 
  user.posts.push(post._id);
  await user.save();

  console.log('user ',user);
  console.log('post',post);


  return res.send(success(201, {post})); 

} catch (e) {
   
    return res.send(error(500, e.message))
  
   }
};

const likeAndUnlikePost = async (req,res) => {
     try {
     const {postId} = req.body;
     const curUserId = req._id;
    
     const post = await Post.findById(postId).populate('Owner')
     if(!post){
        return res.send(error(404, 'post not found '));
     }

     if(post.likes.includes(curUserId)){
        const index = post.likes.indexOf(curUserId);
        post.likes.splice(index, 1);

      //   await post.save();
      //   return res.send(success(200, 'post unliked'));
     } else{
        post.likes.push(curUserId);
      //   await post.save();
      //   return res.send(success(200, 'post liked'));
     }
     await post.save();
     return res.send(success(200, {post : mapPostOutput(post, req._id)}));
     } catch (e) {
        return res.send(error(500, e.message));
     }
};

const updatePostController = async(req,res) => {
   try {
     const {postId,caption} = req.body;
    const curUserId = req._id;

    const post = await Post.findById(postId);
    if(!post){
        return res.send(error(404, "post not found"));
    }

    if(post.Owner.toString() != curUserId ){
        return res.send(error(403, 'user not mathced'))
    }

    if(caption){
        post.caption = caption;
    }
    await post.save();
    return res.send(success(200, {post}))
   } catch (e) {
            return res.send(error(500, e.message));

   }
}

const deletePost = async(req,res) => {
     try {
        const {postId} = req.body;
     const curUserId = req._id;

     const post = await Post.findById(postId);
     const curUser = await User.findById(curUserId)
    if(!post){
        return res.send(error(404, "post not found"));
    }

    if(post.Owner.toString() != curUserId ){
        return res.send(error(403, 'only owner can delete the post '))
    }
     const index = curUser.posts.indexOf(postId);
     curUser.posts.splice(index, 1);
     await curUser.save();
    await Post.findByIdAndDelete(postId);


return res.send(success(200, 'deleted successfully '))
     } catch (e) {
        return res.send(error(500, e.message));
     }
 
    };


module.exports = {
    
    createPostController,
    likeAndUnlikePost,
    updatePostController,
    deletePost,
};