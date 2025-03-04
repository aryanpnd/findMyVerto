import { Alert } from "react-native";
import notifee, { AuthorizationStatus } from "@notifee/react-native";
import { userStorage } from "../storage/storage";

/**
 * Requests notification permissions.
 */
export async function requestNotificationPermission() {
    const dontAsk = userStorage.getString("dontAskNotification");
    if (dontAsk === "true") {
      return; // Exit if the user has chosen not to be asked again
    }
  
    const settings = await notifee.getNotificationSettings();
    const isGranted = settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;
    const firstLaunch = userStorage.getString("firstLaunch");
  
    if (!firstLaunch) {
      console.log('First launch');
      // Mark first launch as complete
      userStorage.set("firstLaunch", "false");
  
      Alert.alert(
        "Stay Updated! 📢",
        "We'd love to keep you in the loop with updates about your friends, friend requests, and other important info. Please allow notifications! 😊",
        [
          {
            text: "Allow",
            onPress: async () => {
              // Request permissions using notifee
              const newSettings = await notifee.requestPermission();
              if (newSettings.authorizationStatus === AuthorizationStatus.DENIED) {
                Alert.alert(
                  "Permission Required 🚨",
                  "Notification permission is essential for receiving timely updates."
                );
              }
            },
          },
          {
            text: "Don't Ask Again",
            onPress: () => {
              // Save user preference to not ask again
              userStorage.set("dontAskNotification", "true");
            },
            style: "cancel"
          }
        ]
      );
    } else if (!isGranted) {
      console.log('Permission not granted');
      // Regular launch, but permission is not granted
      Alert.alert(
        "Enable Notifications! 🔔",
        "Allow notifications to get updates about your friends, friend requests, and other important news.",
        [
          {
            text: "Allow",
            onPress: async () => {
              const notifSetting = await notifee.requestPermission();
              console.log(notifSetting);
              if (notifSetting.authorizationStatus === AuthorizationStatus.DENIED) {
                await notifee.openNotificationSettings();
              }
              
            },
          },
          {
            text: "Don't Ask Again",
            onPress: () => {
              userStorage.set("dontAskNotification", "true");
            },
            style: "cancel"
          }
        ]
      );
    }
  }