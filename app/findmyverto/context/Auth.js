import React, { createContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCalculatedDate } from '../utils/helperFunctions/dataAndTimeHelpers';
import Toast from 'react-native-toast-message';
import { appStorage, friendsStorage, userStorage } from '../utils/storage/storage';
import { getFcmToken, sendFcmToken } from '../utils/notifications/pushNotificationService';
import { loadCustomServers, loadServers } from '../utils/settings/changeServer';

const AuthContext = createContext();

let auth = {server:{url:""}};

export { auth };

const AuthProvider = ({ children }) => {

  const [auth, setAuthState] = useState({
    server: {},
    authenticated: false,
    reg_no: "",
    password: "",
    passwordExpiry: {
      days: 0,
      updatedAt: ""
    }
  })
  const [onboarding, setOnboarding] = useState(false);

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
        let randomServer = {}

        const customeServerSelected = appStorage.getBoolean("IS_CUSTOM_SERVER_SELECTED");
        
        if (customeServerSelected) {
          const selectedServer = appStorage.getString("SELECTED_CUSTOM_SERVER");
          randomServer = JSON.parse(selectedServer)
        }else{
          let servers = loadServers()
          randomServer = servers[Math.floor(Math.random() * servers.length)]
        }
        
        if (JSON.parse(authenticated)) {
          const calculatedDate = getCalculatedDate(JSON.parse(passwordExpiry).days, JSON.parse(passwordExpiry).updatedAt);
          const pwdExp = {
            days: calculatedDate.daysLeft,
            updatedAt: calculatedDate.updateBefore
          }
          if (calculatedDate.daysLeft <= 0) {
            setAuthState({
              authenticated: false,
              reg_no: "",
              password: "",
              passwordExpiry: pwdExp,
              server: randomServer
            });
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Password Expired',
              text2: 'Please login again'
            });
          } else {
            const isFcmTokenAvailable = userStorage.getString("FCM_TOKEN");
            if (!isFcmTokenAvailable) {
              const fcmToken = await getFcmToken();
              sendFcmToken({ reg_no: regNo, password: pass }, fcmToken);
            }

            setAuthState({
              authenticated: JSON.parse(authenticated),
              reg_no: regNo || "",
              password: pass || "",
              passwordExpiry: pwdExp,
              server: randomServer
            });
          }
        }else{
          setAuthState({
            authenticated: false,
            reg_no: "",
            password: "",
            passwordExpiry: { days: 0, updatedAt: "" },
            server: randomServer
          });
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
    userStorage.clearAll()
    friendsStorage.clearAll()
    setAuthState({ ...auth, authenticated: false, reg_no: "", password: "", passwordExpiry: { days: 0, updatedAt: "" } });
  };

  return (
    <AuthContext.Provider value={{
      auth, setAuth, setAuthState,onboarding, setOnboarding, loadAuth, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };