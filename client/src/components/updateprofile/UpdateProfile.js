import React, { useEffect, useState } from 'react'
import './UpdateProfile.scss'
import defaultuserImg from '../../assets/user.jpg'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading, updateMyProfile } from '../../redux/slices/appConfigSlice'
import axios from 'axios'
import { KEY_ACCESS_TOKEN } from '../../utils/localStorageManager'
import { getItem } from '../../utils/localStorageManager'
import { useNavigate } from 'react-router-dom'
const UpdateProfile = () => {
     
    const myProfile = useSelector(state => state.appConfig.myProfile)
    const [name, setName] = useState('');
    const [bio, setBio] = useState('')
    const [userImg, setUserImg] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
      setName(myProfile?.name || "")
      setBio(myProfile?.bio || "")
      setUserImg(myProfile?.avatar?.url  )
     }, [myProfile])

    function handleImageChange(e){
          const file = e.target.files[0]

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

  const handleDeleteUser = async () => {
    const accessToken = getItem(KEY_ACCESS_TOKEN);

    try {
      const res = await axios.delete("http://localhost:4000/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Delete Success:", res.data);
      localStorage.clear();
      navigate("/signup");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
      
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
                <button className='delete-account btn-primary' onClick={handleDeleteUser}>Delete account</button> 
            </div>
        </div>
      
    </div>
  )
} 

export default UpdateProfile






