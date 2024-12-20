import { sendNotification } from '../config/pushNotificationService.js';

export default (agenda) => {
    // Definir el trabajo "sendTaskNotification"
    agenda.define('sendTaskNotification', async (job) => {
        const { deviceToken, title } = job.attrs.data; // Obtener datos del trabajo

        try {
            // Lógica para enviar la notificación
            const notificationTitle = 'Recordatorio de tarea';
            const notificationBody = `Tu tarea "${title}" vence hoy. ¡No olvides completarla!`;

            console.log(`Enviando notificación: ${notificationTitle} - ${notificationBody}`);
            await sendNotification(deviceToken, notificationTitle, notificationBody);
        } catch (error) {
            console.error('Error al enviar la notificación:', error);
        }
    });
};
