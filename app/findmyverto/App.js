import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthPage from './AuthPage';
import { AuthProvider } from './context/Auth';
import { AppProvider } from './context/MainApp';
import { initializeAnalytics } from './utils/analytics/config';
import { initializePushNotification, pushNotificationsHandler } from './utils/notifications/pushNotificationService';

// Initialize analytics
initializeAnalytics();


export default function App() {
  useEffect(() => {
    initializePushNotification();
    const unsubscribe = pushNotificationsHandler()
    return unsubscribe;
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
