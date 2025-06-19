import React from 'react'
import Avatar from '../avatar/Avatar'
import './Post.scss'
import dummyImg from '../../assets/dummy.jpg'
import { FaRegHeart } from "react-icons/fa";
import {useDispatch , useSelector} from "react-redux"
import { likeAndUnlikePost } from '../../redux/slices/postsSlice';
import { FaHeart } from "react-icons/fa";
import {useNavigate } from "react-router"
import { showToast } from '../../redux/slices/appConfigSlice';
import { TOAST_SUCCESS } from '../../App';
import axios from 'axios';
import { getFeedData } from '../../redux/slices/feedSlice';
import { getItem } from '../../utils/localStorageManager';
import { KEY_ACCESS_TOKEN } from '../../utils/localStorageManager';


const Post = ({post}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("KEY_ACCESS_TOKEN"); // ✅ ADDED
  const currentUser = useSelector((state) => state.appConfig.myProfile); // ✅ ADDED

  

  
  
  async function handlePostLiked(){
    dispatch(showToast({
      type:TOAST_SUCCESS,
      message:'liked or unliked',
    }))
     dispatch(likeAndUnlikePost({
      postId: post._id
    
    }))
  }

   async function handleDelete() {
  const accessToken = getItem(KEY_ACCESS_TOKEN); // ✅ Fetch token on button click (latest)
  console.log("Token inside handleDelete:", accessToken); // Should now print full JWT

  try {
    await axios({
      method: 'delete',
      url: 'http://localhost:4000/posts',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        postId: post._id
      }
    });

    dispatch(getFeedData()); // Refresh feed after delete
  } catch (err) {
    console.error("Delete error:", err);
  }
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
         {/* ✅ ADDED: Show Delete button to post owner only */}
        {post.Owner._id === currentUser?._id && (
          <button onClick={handleDelete} className='delete-btn'>
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default Post
