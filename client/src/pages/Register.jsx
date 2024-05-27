import React, { useState } from 'react'
import { Link } from  'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


export const Register = () => {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const navigate = useNavigate();
    
  async function registerUser(ev){
    ev.preventDefault();
    try{
        await axios.post('https://frontend-airbnb-coral.vercel.app/register',{name,email,password});
        alert("Registration Successful. You can Login!");
      }
    catch(e){ 
      alert(e.response.data.error);
      navigate('https://frontend-airbnb-coral.vercel.app/login');
      }
    }
  return (
    <div className='mt-4 grow flex items-center justify-around'>
    <div className='mb-32'>
    <h1 className='text-4xl text-center mb-4'>Register</h1>
      <form className='max-w-md mx-auto' onSubmit={registerUser}>
      <input type='text' placeholder='Name' 
       value ={name} 
       onChange={ev => setName(ev.target.value)}/>  
      <input type='email' placeholder='youremail@.com'       
       value ={email} 
       onChange={ev => setEmail(ev.target.value)}/>  
      <input type='password' placeholder='Password'
       value ={password} 
       onChange={ev => setPassword(ev.target.value)}/>  
      <button className='primary'>Register</button>
        <div className='text-center py-2 text-gray-500'>
          Already a member?
          <Link className='underline text-black'to ={'/login'}>Register</Link>
        </div>
      </form>
    </div>
    </div>
  )
}
