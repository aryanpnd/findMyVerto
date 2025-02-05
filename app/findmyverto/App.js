import { NavigationContainer } from '@react-navigation/native';
import AuthPage from './AuthPage';
import { AuthProvider } from './context/Auth';
import { AppProvider } from './context/MainApp';
import React, { useEffect } from 'react';
// import * as Updates from 'expo-updates';

export default function App() {
  // useEffect(() => {
  //   const checkForUpdates = async () => {
  //     try {
  //       const update = await Updates.checkForUpdateAsync();
  //       if (update.isAvailable) {
  //         await Updates.fetchUpdateAsync();
  //         console.log('Update available and will be applied on next restart.');
  //       } else {
  //         console.log('No updates available.');
  //       }
  //     } catch (error) {
  //       console.error('Error checking for updates:', error);
  //     }
  //   };

  //   checkForUpdates();
  // }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <NavigationContainer>
          <AuthPage />
        </NavigationContainer>
      </AppProvider>
    </AuthProvider>
  );
}
