import {React,  useContext, useState } from 'react'
import { UserContext } from '../UserContext.jsx'
import { Link,Navigate, useParams } from 'react-router-dom';
import  axios  from 'axios';
import  PlacesPage  from './PlacesPage.jsx';
import { AccountNav } from './AccountNav.jsx';
export const ProfilePage = () => {
  const [redirect,setRedirect] = useState(null);
  const {ready,user,setUser} = useContext(UserContext);
  let {subpage} = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('https://frontend-airbnb-coral.vercel.app/logout');
    setRedirect('/');
    setUser(null);
  }
  async function updatepass() {
    setRedirect('/updatepassword');
  }

  if (!ready) {
    return 'Loading...';
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div>
    <AccountNav/>
      {subpage === 'profile' &&(
        <div className='text-center max-w-lg mx-auto'>
          Logged in as {user.name} ({user.email}) <br/>
           <button onClick={logout} className='primary max-w-sm mt-2'>Logout</button>
           <button onClick={updatepass} className='primary max-w-sm mt-2'>Update Password</button>
        </div>
      )}
      {subpage ==='places' &&(
        <PlacesPage/>
      )}
    </div>
  )
}
