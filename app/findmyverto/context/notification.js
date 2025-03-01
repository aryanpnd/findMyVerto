// notification.js
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../utils/notifications/registerForPushNotification";
import { navigate } from "../utils/navigation/RootNavigation";

const NotificationContext = createContext(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(setExpoPushToken)
      .catch(setError);

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("🔔 Notification Received: ", notification);
        setNotification(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("🔔 Notification Response: ", response);
        const screen = response.notification.request.content.data.data.screen;
        if (screen) {
          navigate(screen); // Use the navigate function from RootNavigation
        }
      }
    );

    // Check if the app was opened by a notification
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const screen = response.notification.request.content.data.data.screen;
        if (screen) {
          navigate(screen); // Use the navigate function from RootNavigation
        }
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
      {children}
    </NotificationContext.Provider>
  );
};
