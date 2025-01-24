import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { getCalculatedDate } from '../src/utils/helperFunctions/dataAndTimeHelpers';

const AuthContext = createContext();

let API_URL;
if (process.env.NODE_ENV === 'development') {
  API_URL = "http://192.168.93.229:3000/api/v2";
  // API_URL = "https://findmyvertov2-8wup.onrender.com/api/v2";
} else {
  // API_URL = `${process.env.EXPO_PUBLIC_FMV_API_URL}`;
  API_URL = "https://findmyvertov2-8wup.onrender.com/api/v2";
}
export { API_URL };

const AuthProvider = ({ children }) => {

  const [auth, setAuthState] = useState({
    authenticated: false,
    reg_no: "",
    password: "",
    passwordExpiry: {
      days: 0,
      updatedAt: ""
    }
  })

  const setAuth = async (data) => {
    setAuthState({ ...auth, ...data })
    if (data.reg_no) {
      await SecureStore.setItemAsync("REG_NO", data.reg_no)
    }
    if (data.password) {
      await SecureStore.setItemAsync("PASSWORD", data.password)
    }
    if (data.passwordExpiry) {
      await SecureStore.setItemAsync("PASSWORDEXPIRY", JSON.stringify(data.passwordExpiry))
    }
    if (data.authenticated) {
      await SecureStore.setItemAsync("AUTHENTICATED", JSON.stringify(data.authenticated))
    }
  }

  const loadAuth = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let regNo = await SecureStore.getItemAsync("REG_NO");
        let pass = await SecureStore.getItemAsync("PASSWORD");
        let authenticated = await SecureStore.getItemAsync("AUTHENTICATED");
        let passwordExpiry = await SecureStore.getItemAsync("PASSWORDEXPIRY");
        if (authenticated) {
          const calculatedDate = getCalculatedDate(JSON.parse(passwordExpiry).days, JSON.parse(passwordExpiry).updatedAt);
          const pwdExp = {
            days: calculatedDate.daysLeft,
            updatedAt: calculatedDate.updateBefore
          }
          setAuthState({
            authenticated: JSON.parse(authenticated),
            reg_no: regNo || "",
            password: pass || "",
            passwordExpiry: pwdExp
          });

          // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  const logout = async () => {
    await SecureStore.setItemAsync("AUTHENTICATED", JSON.stringify(false));
    await SecureStore.deleteItemAsync("REG_NO");
    await SecureStore.deleteItemAsync("PASSWORD");
    await SecureStore.deleteItemAsync("PASSWORDEXPIRY");
    await AsyncStorage.clear();
    setAuthState({ authenticated: false, reg_no: "", password: "", passwordExpiry: { days: 0, updatedAt: "" } });
  };

  const logout2 = async () => {
    await SecureStore.setItemAsync("AUTHENTICATED", JSON.stringify(false));
    await SecureStore.deleteItemAsync("REG_NO");
    await SecureStore.deleteItemAsync("PASSWORD");
    await SecureStore.deleteItemAsync("PASSWORDEXPIRY");
    await AsyncStorage.clear();
    setAuthState({ authenticated: false, reg_no: "", password: "", passwordExpiry: { days: 0, updatedAt: "" } });
  };


  return (
    <AuthContext.Provider value={{
      auth, setAuth, setAuthState, loadAuth, logout, logout2
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };