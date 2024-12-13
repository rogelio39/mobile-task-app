import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config(); // Asegúrate de cargar las variables de entorno


const base64Credentials = process.env.GOOGLE_CREDENTIALS.replace(/\n/g, '');
const serviceAccountJson = Buffer.from(base64Credentials, 'base64').toString('utf-8');
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
