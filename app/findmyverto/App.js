// App.js
import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthPage from './AuthPage';
import { AuthProvider } from './context/Auth';
import { AppProvider } from './context/MainApp';
import { initializeAnalytics } from './utils/analytics/config';
import { handleBackgroundMessage, handleKiledStatelNotification, initPushNotificationService } from './utils/notifications/pushNotificationService';
import messaging from '@react-native-firebase/messaging';
import { linking } from './utils/navigation/pushNotificationNavigation';
import { requestNotificationPermission } from './utils/notifications/notificationPermission';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Initialize analytics
initializeAnalytics();
handleBackgroundMessage();
// handleKiledStatelNotification(); // idk why this is not working for expo with notifee

export default function App() {
  useEffect(() => {
    requestNotificationPermission();
    let unsubscribe;
    const initializeNotifications = async () => {
      unsubscribe = await initPushNotificationService();
    };
    initializeNotifications();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <NavigationContainer linking={linking}>
          <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <AuthPage />
          </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </NavigationContainer>
      </AppProvider>
    </AuthProvider>
  );
}
