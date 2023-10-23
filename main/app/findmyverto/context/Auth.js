import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

// export const API_URL = "http://192.168.191.229:8080"
export const API_URL = "https://findmyverto.onrender.com"

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
    await SecureStore.deleteItemAsync("REGNO");
    await SecureStore.deleteItemAsync("PASS");
    await SecureStore.deleteItemAsync("TOKEN");
    await AsyncStorage.clear()
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