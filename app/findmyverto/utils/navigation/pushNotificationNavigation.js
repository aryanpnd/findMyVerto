import { Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';


// Helper to build a deep link URL from the notification payload.
// Expecting the payload to include a key (e.g., 'screen') with values "FriendRequests" or "Friends".
function buildDeepLinkFromNotificationData(data) {
    if (!data) return null;
    const screen = data.screen; // adjust this if your payload uses a different key
    if (screen === 'FriendRequests') {
        return 'myapp://friendrequests';
    }
    if (screen === 'Friends') {
        return 'myapp://friends';
    }
    return null;
}

export const linking = {
    prefixes: ['myapp://'],
    config: {
        screens: {
            // Other screens can be added here as needed.
            Home: 'home',
            Attendance: 'attendance',
            // … (other screen mappings)
            FriendRequests: 'friendrequests',
            Friends: 'friends',
        },
    },
    // When the app is launched from a quit state:
    async getInitialURL() {
        const url = await Linking.getInitialURL();
        if (url) return url;
        const message = await messaging().getInitialNotification();
        return buildDeepLinkFromNotificationData(message?.data);
    },
    // When the app is in the background and opened by a notification:
    subscribe(listener) {
        const onReceiveURL = ({ url }) => listener(url);
        const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
        const unsubscribeNotification = messaging().onNotificationOpenedApp(remoteMessage => {
            const url = buildDeepLinkFromNotificationData(remoteMessage.data);
            if (url) listener(url);
        });
        return () => {
            linkingSubscription.remove();
            unsubscribeNotification();
        };
    },
};