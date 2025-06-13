import React, { useEffect, useState } from 'react'
import './UpdateProfile.scss'
import defaultuserImg from '../../assets/user.jpg'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading, updateMyProfile } from '../../redux/slices/appConfigSlice'

const UpdateProfile = () => {
     
    const myProfile = useSelector(state => state.appConfig.myProfile)
    const [name, setName] = useState('');
    const [bio, setBio] = useState('')
    const [userImg, setUserImg] = useState('')
    const dispatch = useDispatch();

    useEffect(() => {
      setName(myProfile?.name || "")
      setBio(myProfile?.bio || "")
      setUserImg(myProfile?.avatar?.url  )
     }, [myProfile])
    // console.log('my profile is', myProfile);

    function handleImageChange(e){
          const file = e.target.files[0]
  //          if (!file) {
  //   // Agar file undefined ya null ho to function return kar de
  //   return;
  // }
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () =>{
            if(fileReader.readyState === fileReader.DONE){
              setUserImg(fileReader.result)   
            }
        }
    }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !bio || !userImg) {
      alert("All fields are required.");
      

      return;
      
    }
      dispatch(
      updateMyProfile({
        name,
        bio,
      userImg,
      })
    );
  } 
      
  return ( 
    <div className='Updateprofile'>
        <div className='container'>
            <div className='left-part'>
                <div className='input-user-Img'>
                           <label htmlFor="inputImg" className='labelImg'>
                            <img src={userImg? userImg: defaultuserImg} alt={name} />
                            </label>
                          
                          <input 
                          className='inputImg'
                          id='inputImg' 
                          type='file' 
                          accept='Image/*' 
                          onChange={handleImageChange} ></input>
                        </div>       
            </div>
            <div className='right-part'>
                <form onSubmit={handleSubmit} >
                  <input 
                  value={name} 
                  type='text' 
                  placeholder='your name' 
                  onChange={(e)=> setName(e.target.value)} /> 
                  
                  
                  <input 
                  value={bio} 
                  type='text' 
                  placeholder='your bio' 
                  onChange={(e)=> setBio(e.target.value)} />
                        
                  <input type='submit' className='btn-primary' onClick={handleSubmit}/>
                </form>
                <button className='delete-account btn-primary'>Delete account</button> 
            </div>
        </div>
      
    </div>
  )
} 

export default UpdateProfile






