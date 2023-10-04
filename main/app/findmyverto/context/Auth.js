import axios from 'axios';
import React, { createContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';


const AuthContext = createContext();

const API_URL = "http://findmyverto.onrender.com"

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: "",
    authenticated: false
  })

  const login = async (regno, pass) => {
    try {
      const result = await axios.post(`${API_URL}/api/auth/login`, { regNo: regno, password: pass })

      setAuth({
        token: result.data.token,
        authenticated: true
      })
      axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`
      await SecureStore.setItemAsync("TOKEN", result.data.token)
      return result;
    } catch (error) {
      console.log(error);
      return { error: true }
    }
  }

  return (
    <AuthContext.Provider value={{
      auth, setAuth,login
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };