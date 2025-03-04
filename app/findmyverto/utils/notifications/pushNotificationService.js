import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AuthorizationStatus, EventType } from '@notifee/react-native';
import { colors } from '../../src/constants/colors';
import { userStorage } from '../storage/storage';
import { API_URL } from '../../context/Auth';
import axios from 'axios';

/**
 * Creates a default notification channel (Android).
 */
async function createDefaultChannel() {
  const channelId = await notifee.createChannel({
    id: 'Friends',
    name: 'Friends',
    importance: AndroidImportance.HIGH,
  });
  return channelId;
}

/**
 * Registers a handler for foreground notifications.
 * @returns {Function} unsubscribe function for the onMessage listener.
 */
function registerForegroundNotificationHandler() {
  return messaging().onMessage(async remoteMessage => {
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId: 'Friends',
        largeIcon: remoteMessage.data.studentImage,
        circularLargeIcon: true,
        color: colors.secondary,
      },
    });
  });
}


export function handleKiledStatelNotification() {
  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId: 'Friends',
          largeIcon: remoteMessage.data.studentImage,
          circularLargeIcon: true,
          color: colors.secondary,
        },
      });
    }
  });
}

export function handleBackgroundMessage() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    // await notifee.displayNotification({
    //   title: remoteMessage.notification.title,
    //   body: remoteMessage.notification.body,
    //   android: {
    //     channelId: 'default',
    //     largeIcon: remoteMessage.data.studentImage,
    //     circularLargeIcon: true,
    //     color: colors.secondary,
    //   },
    // });
  });

  notifee.onBackgroundEvent(async ({ type, detail }) => {

    // Handle notification actions or dismissal events here if needed.
    if (type === EventType.ACTION_PRESS) {
      // Process the action press event
      console.log('User pressed a notification action:', detail.pressAction);
    }
  });
}

export const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    userStorage.set('FCM_TOKEN', fcmToken);
    return fcmToken;
  } else {
    console.log('Failed', 'No token received');
    return null;
  }
}

export const sendFcmToken = async (auth, fcmToken) => {
  try {
    const result = await axios.post(`${API_URL}/student/settings/setDevicePushToken`, {
      reg_no: auth.reg_no,
      password: auth.password,
      devicePushToken: fcmToken
    });
    if (result.data.success) {
      console.log('FCM Token sent successfully');
    } else {
      console.log('FCM Token not sent');
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Initializes push notification services.
 * Requests permissions, creates a notification channel, and registers the foreground handler.
 * @returns {Promise<Function>} unsubscribe function for the onMessage listener.
 */
export async function initPushNotificationService() {
  await createDefaultChannel();
  return registerForegroundNotificationHandler();
}
