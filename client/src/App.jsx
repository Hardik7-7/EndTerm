import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Route,Routes} from "react-router-dom"
import { IndexPage } from './pages/indexpage'
import { Login } from './pages/Login'
import { Layout } from './Layout'
import { Register } from './pages/Register'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import { ProfilePage } from './pages/ProfilePage'
import  PlacesPage  from './pages/PlacesPage'
import  PlacePage  from './pages/PlacePage'
import  PlacesFormPage  from './pages/PlacesFormPage'
import BookingPage from './pages/BookingPage'
import BookingsPage from './pages/BookingsPage'
import  UpdatePassword  from './pages/UpdatePassword'

axios.defaults.baseURL = 'https://frontend-airbnb-coral.vercel.app'
axios.defaults.withCredentials = true;
function App() {
  return (
        <UserContextProvider>
         <Routes>
          <Route path="/" element={<Layout/>}>
              <Route index element = {<IndexPage/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/updatepassword" element={<UpdatePassword/>} />
              <Route path="/account" element={<ProfilePage/>} />
              <Route path="/account/places" element={<PlacesPage/>} />
              <Route path="/account/places/new" element={<PlacesFormPage/>} />
              <Route path="/account/places/:id" element={<PlacesFormPage />} />
              <Route path="/place/:id" element={<PlacePage />} />
              <Route path="/account/bookings" element={<BookingsPage/>} />
          <Route path="/account/bookings/:id" element={<BookingPage/>} />
          </Route>
        </Routes>
        </UserContextProvider>
  )
}

export default App
