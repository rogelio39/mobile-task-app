// notifications.js
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();


console.log('GOOGLE_SERVICE_ACCOUNT_KEY:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

/**
 * Obtiene un access token desde Firebase usando las credenciales de service-account.json
 */
export async function getAccessToken() {
    try {
        const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

        const jwtClient = new JWT(
            serviceAccount.client_email,
            null,
            serviceAccount.private_key.replace(/\\n/g, '\n'), // Asegura el formato correcto de la clave privada
            ['https://www.googleapis.com/auth/firebase.messaging'] // Scope necesario para FCM
        );

        const tokens = await jwtClient.authorize();
        console.log('Access token generado:', tokens.access_token);
        return tokens.access_token;
    } catch (error) {
        console.error('Error obteniendo el access token:', error.message);
        throw new Error('No se pudo obtener el access token. Verifica las credenciales.');
    }
}

/**
 * Envía una notificación push a un dispositivo usando FCM
 * 
 * @param {string} deviceToken - Token del dispositivo receptor
 * @param {string} title - Título de la notificación
 * @param {string} body - Cuerpo de la notificación
 */
export async function sendNotification(deviceToken, title, body) {
    try {
        const accessToken = await getAccessToken();
        const projectId = process.env.FCM_PROJECT_ID;

        const message = {
            message: {
                token: deviceToken,
                notification: {
                    title: title,
                    body: body,
                },
                data: {
                    extraInfo: 'Información adicional',
                },
            },
        };

        const response = await fetch(
            `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            }
        );

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error enviando notificación:', errorResponse);
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Notification Response:', result);
        return result;
    } catch (error) {
        console.error('Error al enviar la notificación:', error.message);
        throw new Error('No se pudo enviar la notificación. Verifica los detalles.');
    }
}
