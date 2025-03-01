import { NavigationContainer } from "@react-navigation/native";
import AuthPage from "./AuthPage";
import { AuthProvider } from "./context/Auth";
import { AppProvider } from "./context/MainApp";
import React, { useEffect } from "react";
import { initializeAnalytics } from "./utils/analytics/config";
import { NotificationProvider } from "./context/notification";
import * as Notifications from "expo-notifications";
import { navigationRef } from "./utils/navigation/RootNavigation";

initializeAnalytics();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationContainer ref={navigationRef}>
          <NotificationProvider>
            <AuthPage />
          </NotificationProvider>
        </NavigationContainer>
      </AppProvider>
    </AuthProvider>
  );
}
