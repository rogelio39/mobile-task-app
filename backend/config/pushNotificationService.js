import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config(); // Asegúrate de cargar las variables de entorno

const serviceAccountJson = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(serviceAccountJson);

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
