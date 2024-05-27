import React,{ useContext, useState } from 'react'
import { Link, Navigate } from  'react-router-dom'
import axios from 'axios';
import { UserContext } from '../UserContext';
export const Login = () => {
  const [email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const{setUser} = useContext(UserContext);
  async function handleLogin(ev){
    ev.preventDefault();
    try{
       const response = await axios.post('/login',{email,password});
         setUser(response.data);
         alert("Login Successful");
         setRedirect(true);
      }
    catch(e){
          alert("Login Unsuccessful");
      }
    }
    if(redirect){
       return <Navigate to={'/'}/>
    }
  return (
    <div className='mt-4 grow flex items-center justify-around'>
    <div className='mb-32'>
    <h1 className='text-4xl text-center mb-4'>LOGIN</h1>
      <form className='max-w-md mx-auto' onSubmit={handleLogin}>
      <input type='email' placeholder='youremail@.com'       
       value ={email} 
       onChange={ev => setEmail(ev.target.value)}/>  
      <input type='password' placeholder='Password'
       value ={password} 
       onChange={ev => setPassword(ev.target.value)}/>  
      <button className='primary'>Login</button>
        <div className='text-center py-2 text-gray-500'>
          Don't have an account yet?
          <Link className='underline text-black'to ={'/register'}>Register now</Link>
        </div>
        <div className='text-center py-2 text-gray-500'>
         Want to Change Password?
          <Link className='underline text-black'to ={'/updatepassword'}>Update Password</Link>
        </div>
      </form>
    </div>
    </div>
  )
}
