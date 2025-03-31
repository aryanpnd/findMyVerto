import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthPage from './AuthPage';
import { AuthProvider } from './context/Auth';
import { AppProvider } from './context/MainApp';
import { initializeAnalytics } from './utils/analytics/config';
import { handleBackgroundMessage, initPushNotificationService } from './utils/notifications/pushNotificationService';
import { linking } from './utils/navigation/pushNotificationNavigation';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NotificationPermissionSheet from './src/components/miscellaneous/NotificationPermissionSheet';

// Initialize analytics
initializeAnalytics();
handleBackgroundMessage();
// handleKiledStatelNotification(); // idk why this is not working for expo with notifee

export default function App() {
  const notificationSheetRef = useRef();

  useEffect(() => {
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
              <AuthPage notificationSheetRef={notificationSheetRef} />
              <NotificationPermissionSheet ref={notificationSheetRef} />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </NavigationContainer>
      </AppProvider>
    </AuthProvider>
  );
}
