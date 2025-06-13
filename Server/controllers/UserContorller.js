const { populate } = require("dotenv");
const Post = require("../models/Post");

const User = require("../models/User");
const { post } = require("../routers/PostRouter");
const { error, success } = require("../utlis/ResponseWrapper");
const cloudinary = require('cloudinary').v2;
const {mapPostOutput} = require('../utlis/Utils')



const followOrUnfollowUserController = async (req,res) =>{
try {
    const {userIdToFollow} = req.body;
const curUserId = req._id;

const userToFollow = await User.findById(userIdToFollow);
const curUser = await User.findById(curUserId)
 
if(curUserId === userIdToFollow){
    return res.send(error(409, ' cannot follow yourself'))
}

if(!userToFollow){
    return res.send(error(404, 'user to follow not found '));
}

if(curUser.following.includes(userIdToFollow)){
    //already followed 
  const index = curUser.following.indexOf(userIdToFollow);
  curUser.following.splice(index, 1);

  const followerIndex = userToFollow.followers.indexOf(curUserId);
  userToFollow.followers.splice(followerIndex, 1);

// 

//  return res.send(success(200, 'user unfollowed'))
}

else{
userToFollow.followers.push(curUserId);
curUser.following.push(userIdToFollow);

//  await userToFollow.save();
//  await curUser.save();

//   return res.send(success(200, 'user followed'))
}
 await userToFollow.save();
 await curUser.save();
return res.send(success(200, {user:userToFollow}))
} catch (e) {
    console.log(e)
    return res.send(error(500,e.message));
} 
} ;

const getPostsOfFollowing =async(req,res) => {
    try {
        const curUserId = req._id;

    const curUser = await User.findById(curUserId).populate('following')

    const fullPosts = await Post.find({
        Owner:{
            '$in': curUser.following
        }
    }).populate('Owner');
   const posts = fullPosts
   .map(item => mapPostOutput(item, req._id))
   .reverse();

//    console.log('posts here ', posts)
  curUser.posts = posts;
const followingIds = curUser.following.map((item) => item._id)
followingIds.push(req._id);
const suggestions  = await User.find({
    _id: {
        $nin: followingIds
        //  $nin: [...followingIds, curUserId]
    }
})
    return res.send(success(201, {...curUser._doc, suggestions, posts}));
    } catch (e) {
         return res.send(error(500, e.message));
        
    }
}

const getMyPosts = async(req,res) => {
try {
    const curUserId = req._id;
    const allUserPosts = await Post.find({
        Owner: curUserId
    }).populate('likes');
    return res.send(success(201, {allUserPosts}))
} catch (e) {
    console.log(e)
      return res.send(error(500,e.message));
}
}

const getUserPosts = async(req,res)=>{
    try {
        const userId = req.body.userId;
         if(!userId){
                res.send(error(404, 'userId is required'))
             }

             
        const allUserPosts = await Post.find({
            Owner: userId
        }).populate('likes')
           return res.send(success(201, {allUserPosts}))
    } catch (error) {
         console.log(e)
      return res.send(error(500,e.message));
    }
}




const deleteMyProfile = async(req,res) => {
  try {
      const curUserId = req._id;
      const curUser = await User.findById(curUserId);

      if(!curUser) {
          return res.send(error(404, 'User not found'));
      }

      // delete all posts
      await Post.deleteMany({ Owner: curUserId });

      // remove myself from followers' following list
      await Promise.all(curUser.followers.map(async (followerId) => {
          const follower = await User.findById(followerId);
          if(follower) {
              const index = follower.following.indexOf(curUserId);
              if(index > -1) {
                  follower.following.splice(index, 1);
                  await follower.save();
              }
          }
      }));

      // remove myself from following users' followers list
      await Promise.all(curUser.following.map(async (followingId) => {
          const followingUser = await User.findById(followingId);
          if(followingUser) {
              const index = followingUser.followers.indexOf(curUserId);
              if(index > -1) {
                  followingUser.followers.splice(index, 1);
                  await followingUser.save();
              }
          }
      }));

      // remove likes from posts
      const allPosts = await Post.find();
      await Promise.all(allPosts.map(async (post) => {
          const index = post.likes.indexOf(curUserId);
          if(index > -1) {
              post.likes.splice(index, 1);
              await post.save();
          }
      }));

      // delete user
      await User.findByIdAndDelete(curUserId);

      res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
      });

      return res.send(success(200, 'user deleted'));
  } catch (e) {
      console.log(e);
      return res.send(error(500, e.message));
  }
}




const getMyInfo = async (req, res) => {
  try {
    const user = await User.findById(req._id);
    return res.send(success(200, { user }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};



const updateUserProfile = async (req, res) => {
    try {
        const { name, bio, userImg } = req.body;

        const user = await User.findById(req._id);
       

        if (name) {
            user.name = name;
        }

        if (bio) {
            user.bio = bio;
        }

        if (userImg) {
            const cloudImg = await cloudinary.uploader.upload(userImg, {
                folder: 'userprofile'
            });
            user.avatar = {
                url: cloudImg.secure_url,
                publicId: cloudImg.public_id
            };
        }

        await user.save();  // Save the updated user to DB

        return res.send(success(200, 'Profile updated successfully', { user }));

    } catch (e) {
        console.log(e);
        return res.send(error(500, e.message));
    }
};

const getUserProfile = async (req,res)=>{
    try {
        if (!req.body) {
      return res.send(error(400, 'Request body is missing'));
    }
        const userId = req.body.userId || req._id;

const user = await User.findById(userId)
          .populate('followers', '_id name avatar')  // add this
          .populate('following', '_id name avatar')  // add this
          .populate({
            path:'posts', 
            populate:{
                path:'Owner'
                
            }
          });

const fullPosts= user.posts;
const posts = fullPosts.map(item => mapPostOutput(item, req._id)).reverse();

return res.send(success(200,{...user._doc, posts}))
    } catch (e) {
        console.log(e);
        return res.send(error(500, e.message));
    } 
}



module.exports = {
     followOrUnfollowUserController,
     getPostsOfFollowing,
     getMyPosts,
     getUserPosts,
     deleteMyProfile,
     getMyInfo,
     updateUserProfile,
     getUserProfile,
   
     
}
   
