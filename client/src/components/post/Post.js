import React from 'react'
import Avatar from '../avatar/Avatar'
import './Post.scss'
import dummyImg from '../../assets/dummy.jpg'
import { FaRegHeart } from "react-icons/fa";
import {useDispatch } from "react-redux"
import { likeAndUnlikePost } from '../../redux/slices/postsSlice';
import { FaHeart } from "react-icons/fa";
import {useNavigate } from "react-router"
import { showToast } from '../../redux/slices/appConfigSlice';
import { TOAST_SUCCESS } from '../../App';


const Post = ({post}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  
  
  async function handlePostLiked(){
    dispatch(showToast({
      type:TOAST_SUCCESS,
      message:'liked or unliked',
    }))
     dispatch(likeAndUnlikePost({
      postId: post._id
    
    }))
  }
  
  
  return (
   <div className='Post'>
      <div className='heading' onClick={()=>navigate(`/profile/${post.Owner._id}`) }>
        <Avatar src={post.Owner?.avatar?.url} />
        

        <h4> {post.Owner?.name}</h4>

      </div>

      <div className='content'>
        <img className='img' src= {post.Image?.url} alt='' />
      </div>

      <div className='footer'>
       <div className='like' onClick={handlePostLiked }>
        {post.isLiked ? <FaHeart className='icon' style={{color:'red'}} /> : <FaRegHeart className='icon'/>}
       <h4> {`${post.likesCount}like`} </h4>
       </div>
       <p className='caption'>{post.caption}</p>
       <h6 className='time-ago'> {post?.timeago} </h6>
      </div>
    </div>
  )
}

export default Post
