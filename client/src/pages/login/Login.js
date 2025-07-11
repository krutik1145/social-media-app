import React, { useState } from 'react'
import './Login.scss'
import { Link, useNavigate } from 'react-router-dom';
import {axiosClient} from "../../utils/axiosClient" 
import { KEY_ACCESS_TOKEN, setItem} from '../../utils/localStorageManager';
const Login = () => {
   
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
   




   async function handlesubmit(e) {
  e.preventDefault();

  try {
    const result = await axiosClient.post('/auth/login', {
      email,
      password,
    });

    console.log('Login response:', result);

    setItem(KEY_ACCESS_TOKEN, result.result.accessToken);

    navigate('/');
  } catch (error) {
    console.log(error);
  }
}

     
   
  
  
    return ( 
    <div className='login'>
      <div className='login-box'>
        <h2 className='heading'> Login</h2>

        <form onSubmit={handlesubmit}>
            <label htmlFor="email">email</label>
            <input type='email' className='email' id='email' 
            onChange={(e)=> setEmail(e.target.value)}/>

             <label htmlFor="password">password</label>
            <input type='password' className='password' id='password' 
             onChange={(e)=> setPassword(e.target.value)}/>
           
             <button className='submit'>submit</button> 
             
            
        </form>

        <p className='subheading'>Do not have an account? <Link to="/signup" >signup</Link> </p>
      </div>
    </div>
  )
}

export default Login










 // async  function handlesubmit(e){
    
    // e.preventDefault(); 
    //   // jiise ki vo page ko reload na krde 
    // try {
    //      const result = await axiosClient.post('/auth/login' , {
    //     email,
    //     password
    // });

    // setItem(KEY_ACCESS_TOKEN, result.data.result.accessToken);
   
    // navigate('/');
    //  console.log(result);
 

    // } catch (error) {
    //     console.log(error)
    // }
    // }