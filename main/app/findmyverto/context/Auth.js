import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token:"",
        authenticated:true
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