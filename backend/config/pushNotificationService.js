// notifications.js
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();


// Obtén un accessToken desde Firebase usando el service-account.json
export async function getAccessToken() {
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);


    const jwtClient = new JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        ['https://www.googleapis.com/auth/cloud-platform']
    );

    const tokens = await jwtClient.authorize();
    return tokens.access_token;
}

// Envía una notificación push a un dispositivo usando FCM
export async function sendNotification(deviceToken, title, body) {
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

    const result = await response.json();
    console.log('Notification Response:', result);
    return result;
}
