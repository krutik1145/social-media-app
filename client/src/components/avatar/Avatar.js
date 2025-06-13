import React from 'react'
import userImg from '../../assets/user.jpg'
import './Avatar.scss'

const Avatar = ({src}) => {
  return (
    <div className='Avatar'>
        <img src={src ? src  : userImg} alt='user avatar'></img>
      
    </div>
  )
}

export default Avatar
