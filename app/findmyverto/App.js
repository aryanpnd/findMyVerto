// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthPage from './AuthPage';
import { AuthProvider } from './context/Auth';
import { AppProvider } from './context/MainApp';
import { initializeAnalytics } from './utils/analytics/config';
import { handleBackgroundMessage, initPushNotificationService } from './utils/notifications/pushNotificationService';


// Initialize analytics
initializeAnalytics();

handleBackgroundMessage();

export default function App() {
  useEffect(() => {
    let unsubscribe;
    const initializeNotifications = async () => {
      unsubscribe = await initPushNotificationService();
    };

    initializeNotifications();

    // Clean up the foreground notification listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

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
