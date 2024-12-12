import schedule from 'node-schedule';
import fetch from 'node-fetch';

// Función para enviar notificación push
const sendPushNotification = async (expoPushToken, title, body) => {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: { additionalData: 'Puedes agregar más información aquí' },
    };

    try {
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        console.log('Notificación enviada:', message);
    } catch (error) {
        console.error('Error al enviar notificación:', error);
    }
};

// Función para programar la notificación push
export const schedulePushNotification = (expoPushToken, title, body, sendDate) => {
    if (sendDate <= new Date()) {
        console.error('La fecha de notificación ya ha pasado. No se programará.');
        return;
    }

    schedule.scheduleJob(sendDate, () => {
        sendPushNotification(expoPushToken, title, body);
    });

    console.log(`Notificación programada para: ${sendDate}`);
};
