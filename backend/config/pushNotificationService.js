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
        const projectId = process.env.FCM_PROJECT_ID; // Asegúrate de que este valor esté definido en tu archivo .env

        // Crear el mensaje a enviar
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

        // Realizar la solicitud para enviar la notificación
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

        // Comprobar si la respuesta es correcta
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
