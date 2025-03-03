import * as admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.cert(require('../../google-service-account-key.json')),
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

export async function sendPushNotification(title: string, body: string, token: string, imageUrl:string): Promise<void> {
    console.log(token)
    try {
        await admin.messaging().send({
            notification:{
                title: title,
                body: body
            },
            data: {
                title: title,
                body:body,
                studentImage: imageUrl
            },
            android:{
                notification:{
                    imageUrl: imageUrl,
                    color: "#5665DA",
                    priority: "high"
                }
            },
            token: token
        });
    } catch (error: any) {
        console.error(error.message);
    }
}

