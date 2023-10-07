import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const API_URL = "http://findmyverto.onrender.com"

const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState({
    token: "",
    authenticated: false,
    regNo: "",
    pass: ""
  })

  useEffect(() => {
    const loadAuth = async () => {
      let regNo = await SecureStore.getItemAsync("REGNO");
      let pass = await SecureStore.getItemAsync("PASS");
      let token = await SecureStore.getItemAsync("TOKEN");
      let authenticated = await SecureStore.getItemAsync("AUTHENTICATED");
      if (authenticated) {
        setAuth({
          token:token,
          authenticated:JSON.parse(authenticated),
          regNo:regNo,
          pass:pass
        })
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
        return
      }
    }
    loadAuth()
  }, [])

  const logout = async ()=>{
    await SecureStore.setItemAsync("AUTHENTICATED",JSON.stringify(false));
    setAuth({ ...auth, authenticated: false })
  }


  return (
    <AuthContext.Provider value={{
      auth, setAuth,logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };