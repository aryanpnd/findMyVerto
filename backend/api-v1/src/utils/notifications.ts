import * as admin from 'firebase-admin';

const googleProjectId = process.env.GOOGLE_PROJECT_ID;
const googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!googleProjectId || !googleClientEmail || !googlePrivateKey) {
    console.warn('Warning: Missing Firebase Admin SDK environment variables. Firebase functionality may not work properly.');
} else {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: googleProjectId,
            clientEmail: googleClientEmail,
            privateKey: googlePrivateKey,
        }),
    });
}

export async function verifyFCMToken(fcmToken: string): Promise<boolean> {
    try {
        if (!admin.apps.length) {
            console.warn('Firebase Admin SDK is not initialized, unable to verify token.');
            return false;
        }
        await admin.messaging().send({
            token: fcmToken
        }, true);
        return true;
    } catch {
        return false;
    }
}

export async function sendPushNotification(title: string, body: string, token: string, imageUrl: string, screen: string): Promise<void> {
    try {
        if (!admin.apps.length) {
            console.warn('Firebase Admin SDK is not initialized, unable to send notification.');
            return;
        }
        await admin.messaging().send({
            notification: {
                title: title,
                body: body
            },
            data: {
                title: title,
                body: body,
                studentImage: imageUrl,
                screen: screen
            },
            android: {
                notification: {
                    imageUrl: imageUrl,
                    color: "#5665DA",
                    priority: "max",
                    channelId: "Friends",
                }
            },
            token: token
        });
    } catch (error: any) {
        console.error(error.message);
    }
}
