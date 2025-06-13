import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './Signup.scss'
import { axiosClient } from '../../utils/axiosClient';


const Signup = () => {


const [name , setName]= useState('')
 const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

  async  function handlesubmit(e){
    
    e.preventDefault(); 
      // jiise ki vo page ko reload na krde 
    try {
         const result = await axiosClient.post('/auth/signup' , {
        name,     
        email,
        password
    });
    console.log(result)

    } catch (error) {
        console.log(error)
    }
    }




 return (
    <div className='signup'>
      <div className='signup-box'>
        <h2 className='heading'> Signup</h2>

        <form onSubmit={handlesubmit}>

            <label htmlFor="name">name</label>
            <input type='text' className='name' id='name' 
            onChange={(e)=> setName(e.target.value)} />

            
            <label htmlFor="email">email</label>
            <input type='email' className='email' id='email' 
            onChange={(e)=> setEmail(e.target.value)}/>

            
            
            <label htmlFor="password">password</label>
            <input type='password' className='password' id='password' 
             onChange={(e)=> setPassword(e.target.value)}/>
           
             <button className='submit'>submit</button> 
             
            
        </form>

        <p className='subheading'>Already have an account? <Link to="/login" >login</Link> </p>
      </div>
    </div>
 )
}

export default Signup
