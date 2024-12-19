import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export async function sendNotification(deviceToken, title, body) {
    try {
        const response = await admin.messaging().send({
            token: deviceToken,
            notification: { title, body },
        });
        console.log('Notificación enviada:', response);
    } catch (error) {
        console.error('Error enviando notificación:', error);
        throw new Error('No se pudo enviar la notificación.');
    }
}

