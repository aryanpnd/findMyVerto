import notifee, { AuthorizationStatus } from "@notifee/react-native";
import { appStorage } from "../storage/storage";

/**
 * Requests notification permissions using a bottom sheet modal.
 * Expects a ref to the NotificationPermissionSheet component.
 */
export async function requestNotificationPermission(notificationSheetRef) {
  const dontAsk = appStorage.getString("dontAskNotification");
  if (dontAsk === "true") {
    return; // Exit if the user has chosen not to be asked again
  }

  const settings = await notifee.getNotificationSettings();
  const isGranted = settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;
  const firstLaunch = appStorage.getString("firstLaunch");

  if (!firstLaunch) {
    // Mark first launch as complete
    appStorage.set("firstLaunch", "false");

    notificationSheetRef.current.open(
      "Stay Updated! 📢",
      "We'd love to keep you in the loop with updates about your friends, friend requests, and other important info. Please allow notifications! 😊",
      async () => {
        // Request permissions using notifee
        const newSettings = await notifee.requestPermission();
        if (newSettings.authorizationStatus === AuthorizationStatus.DENIED) {
          // Show a follow-up bottom sheet if permission is denied
          notificationSheetRef.current.open(
            "Permission Required 🚨",
            "Notification permission is essential for receiving timely updates.",
            async () => {
              const notifSetting = await notifee.requestPermission();
              if (notifSetting.authorizationStatus === AuthorizationStatus.DENIED) {
                await notifee.openNotificationSettings();
              }
            },
            () => {
              appStorage.set("dontAskNotification", "true");
            }
          );
        }
      },
      () => {
        // Save user preference to not ask again
        appStorage.set("dontAskNotification", "true");
      }
    );
  } else if (!isGranted) {
    // Regular launch, but permission is not granted
    notificationSheetRef.current.open(
      "Enable Notifications! 🔔",
      "Allow notifications to get updates about your friends, friend requests, and other important news.",
      async () => {
        const notifSetting = await notifee.requestPermission();
        if (notifSetting.authorizationStatus === AuthorizationStatus.DENIED) {
          await notifee.openNotificationSettings();
        }
      },
      () => {
        appStorage.set("dontAskNotification", "true");
      }
    );
  }
}
