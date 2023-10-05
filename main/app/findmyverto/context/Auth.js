import axios from 'axios';
import React, { createContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';


const AuthContext = createContext();

export const API_URL = "http://findmyverto.onrender.com"

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: "",
    authenticated: false
  })

  return (
    <AuthContext.Provider value={{
      auth, setAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };