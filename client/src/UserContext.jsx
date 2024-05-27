import React, { createContext, useEffect, useState } from "react";
import axios from 'axios';
export const UserContext = createContext({});

export  function UserContextProvider({children}){
    const[user,setUser] = useState(null);
    const[ready,setReady] = useState(false);
    useEffect(() => {
      if (!user) {
        axios.get('https://frontend-airbnb-coral.vercel.app/profile').then((response) => {
          setUser(response.data);
          setReady(true);
        });
      }
    }, []);
    return(
        <UserContext.Provider value={{user,setUser,ready}}>
        {children}
         </UserContext.Provider>
    );
}
