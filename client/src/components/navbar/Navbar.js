import React, { useRef, useState } from 'react'
import './Navbar.scss'
import Avatar from '../avatar/Avatar'
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
// import LoadingBar from 'react-top-loading-bar'
import {  useSelector , useDispatch } from 'react-redux';
import { setLoading } from '../../redux/slices/appConfigSlice';
import { axiosClient } from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, removeItem } from '../../utils/localStorageManager';




const Navbar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myProfile = useSelector(state => state.appConfig.myProfile)
 async function handleLogoutClick(){
    try {
      // dispatch(setLoading(true))
      await axiosClient.post('/auth/logout');
      removeItem(KEY_ACCESS_TOKEN)
      navigate('/login')
      // dispatch(setLoading(false))
    } catch (error) {
      
    }
 }


  return (
    <div className='Navbar'>
      <div className='container'> 
           <div className='banner hover-link' onClick={() => navigate('/')}>
         <h2>
                SOCIAL MEDIA
       </h2>
                  </div>
                  <div className='right_side'>
                  <div className='profile hover-link' onClick={() => navigate(`/profile/${myProfile?._id}`)}>
                  <Avatar src={myProfile?.avatar?.url}/>
                  
      </div>
      <div className='logout hover-link' onClick={handleLogoutClick} >
          <CiLogout />

      </div>
       </div>
      </div>
     
    </div>
  )
}
 
export default Navbar
