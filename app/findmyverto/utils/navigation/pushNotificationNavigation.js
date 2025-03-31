import { Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';


function buildDeepLinkFromNotificationData(data) {
    if (!data) return null;
    const screen = data.screen;
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
            HomeScreen: {
                screens: {
                    Home: {
                        screens: {
                            HomeTab: 'hometab', // Optional: if you need to link to the home tab
                            Friends: 'friends', // Path for the Friends *TAB* -> myapp://friends
                            FeedTab: 'feedtab', // Optional
                            ChatsTab: 'chatstab', // Optional
                        }
                    },
                    // Other Stack Screens directly within HomeNavigator
                    Attendance: 'attendance',       // -> myapp://attendance
                    FriendRequests: 'friendrequests', // -> myapp://friendrequests
                    // ... add other screens from HomeNavigator if needed for deep linking
                    // Note: The 'Friends' stack screen defined in HomeNavigator
                    // is currently shadowed by the 'Friends' tab link above.
                    // If you need to link to the *stack* screen named Friends,
                    // you MUST give it a different path here, e.g.:
                    // FriendsStack: 'friends-stack' // And adjust buildDeepLink accordingly
                }
            },
            FeedScreen: {
                // Add screens for FeedNavigator if deep linking is required there
                // Example: path: 'feed', screens: { ... }
            },
            // If you need to link to screens in AuthNavigator when logged out:
            // AuthRoot: { // Assuming a root screen name in AuthNavigator
            //   screens: {
            //     Login: 'login',
            //     Signup: 'signup',
            //   }
            // }
        },
    },
    // getInitialURL and subscribe functions remain the same
    async getInitialURL() {
        const url = await Linking.getInitialURL();
        if (url) {
            console.log('Initial URL from Linking:', url);
            return url;
        }
        const message = await messaging().getInitialNotification();
        const deepLinkUrl = buildDeepLinkFromNotificationData(message?.data);
        console.log('Initial URL from Notification:', deepLinkUrl, 'Data:', message?.data);
        return deepLinkUrl;
    },
    subscribe(listener) {
        const onReceiveURL = ({ url }) => {
            console.log('Received URL via Linking event:', url);
            listener(url);
        };
        const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

        const unsubscribeNotification = messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification opened app:', remoteMessage);
            const url = buildDeepLinkFromNotificationData(remoteMessage.data);
            console.log('Generated URL from opened notification:', url);
            if (url) {
                listener(url);
            }
        });

        return () => {
            linkingSubscription.remove();
            unsubscribeNotification();
        };
    },
};