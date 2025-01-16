import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const AuthContext = createContext();

// export const API_URL = "http://192.168.1.4:8080"
export const API_URL = "https://findmyvertov2.onrender.com"

const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState({
    token: "",
    authenticated: false,
    regNo: "",
    pass: ""
  })

  const loadAuth = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let regNo = await SecureStore.getItemAsync("REGNO");
        let pass = await SecureStore.getItemAsync("PASS");
        let token = await SecureStore.getItemAsync("TOKEN");
        let authenticated = await SecureStore.getItemAsync("AUTHENTICATED");
        if (authenticated) {
          setAuth({
            token: token,
            authenticated: JSON.parse(authenticated),
            regNo: regNo,
            pass: pass
          })
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  const logout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'Logout', onPress: async () => {
          await SecureStore.setItemAsync("AUTHENTICATED", JSON.stringify(false));
          await SecureStore.deleteItemAsync("REGNO");
          await SecureStore.deleteItemAsync("PASS");
          await SecureStore.deleteItemAsync("TOKEN");
          await AsyncStorage.clear()
          setAuth({ ...auth, authenticated: false })
        }
      },
    ]);
  }

  const logout2 = async () => {
    await SecureStore.setItemAsync("AUTHENTICATED", JSON.stringify(false));
    await SecureStore.deleteItemAsync("REGNO");
    await SecureStore.deleteItemAsync("PASS");
    await SecureStore.deleteItemAsync("TOKEN");
    await AsyncStorage.clear()
    setAuth({ ...auth, authenticated: false })
  }


  return (
    <AuthContext.Provider value={{
      auth, setAuth, loadAuth, logout, logout2
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };