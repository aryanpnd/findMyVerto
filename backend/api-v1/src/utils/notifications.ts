import * as admin from 'firebase-admin'

// admin.initializeApp({
//     credential: admin.credential.cert(require('../../google-service-account-key.json')),
// });

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.GOOGLE_PROJECT_ID,
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
});

export async function verifyFCMToken(fcmToken: string): Promise<boolean> {
    try {
        await admin.messaging().send({
            token: fcmToken
        }, true);
        return true;
    } catch {
        return false;
    }
}

export async function sendPushNotification(title: string, body: string, token: string, imageUrl: string, screen:string): Promise<void> {
    try {
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

