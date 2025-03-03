import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

// Request notification permissions
const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};
requestPermission();


// Create a default channel for Android
const createDefaultChannel = async () => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
  return channelId;
};

createDefaultChannel();

// GET FCM TOKEN
export async function getFcmToken() {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('FCM Token:', fcmToken);
    userStorage.set('fcmToken', fcmToken);
    return fcmToken;
  } else {
    console.log('Failed to get FCM token');
    return null;
  }
}

// Foreground notification handler
export const pushNotificationsHandler = messaging().onMessage(async remoteMessage => {
  console.log('A new FCM message arrived!', remoteMessage);

  // Display the notification using Notifee
  await notifee.displayNotification({
    title: remoteMessage.data.title,
    body: remoteMessage.data.body,
    android: {
      channelId: 'default',
      largeIcon: remoteMessage.data.studentImage,
      circularLargeIcon: true,
      color: colors.secondary,
    },
  });
});


export const initializePushNotification = async () => {
  // Request permission
  await requestPermission();

  // Create a default channel
  await createDefaultChannel();

};