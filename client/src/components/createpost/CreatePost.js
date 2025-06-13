import React, { useState } from 'react'
import './CreatePost.scss'
import Avatar from '../avatar/Avatar'
import backgrounddummyimg from "../../assets/dummy.jpg"
import { BsCardImage } from "react-icons/bs";
import { axiosClient } from '../../utils/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/slices/appConfigSlice';
import { getUserProfile } from '../../redux/slices/postsSlice';


const CreatePost = () => {

  const [postImg, setPostImg] = useState('')
  const [caption, setCaption] = useState('')
  const dispatch = useDispatch('')
  const myProfile = useSelector(state => state.appConfig.myProfile)
  
  const handleImageChange= (e) => {
     const file = e.target.files[0]
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () =>{
            if(fileReader.readyState === fileReader.DONE){
                    console.log("Image base64 result:", fileReader.result); 

              setPostImg(fileReader.result)   
            }
        }
  };

  const handlePostSubmit = async() =>{
    try {
      dispatch(setLoading(true))
      const result = await axiosClient.post('/posts',{
        caption,
        postImg,
        
      });
        // console.log("Caption:", caption);
        // console.log("PostImg:", postImg);
        console.log('post done', result)
        dispatch(getUserProfile({
          userId:  myProfile._id
        }));
    } catch (error) {
          console.error("what is the error :", error);

    } finally{
      dispatch(setLoading(false))
      setCaption('');
      setPostImg('');
    };
  }
  return (
    <div className='CreatePost'>
       <div className='left-part'>
    <Avatar src={myProfile?.avatar?.url} />
        
       <div className='right-part'>
        <input type='text' 
        className='caption' 
        value={caption}
        placeholder="what's on your mind"
        onChange={(e) => setCaption(e.target.value)}
        />  
       
        
        {postImg && (
          <div className='img-container'>
          <img className='post-img' src={postImg} alt=''/>
        </div>) }
        
        <div className='bottom-part'>
          <div className='input-post-img'>
          <label htmlFor="inputImg" className='labelImg'>
                            <BsCardImage />
                            </label>
                          
                          <input 
                          className='inputImg'
                          id='inputImg' 
                          type='file' 
                          accept='Image/*' 
                          onChange={handleImageChange} ></input>
         </div>
         <button className='post-btn btn-primary' onClick={handlePostSubmit}>Post</button>
          </div>
        </div>
       </div>
    </div>
  )
}

export default CreatePost
