// config/agenda.js
import Agenda from 'agenda';
import dotenv from 'dotenv';
import { sendNotification } from './pushNotificationService.js';

dotenv.config();

const agenda = new Agenda({
    db: {
        address: process.env.MONGO_URL, // URI de tu base de datos
        collection: 'agendaJobs', // Colección donde Agenda almacena los trabajos
    },
    processEvery: '1 minute', // Verificar trabajos cada 10 segundos
});

// Definir el trabajo "sendTaskNotification"
agenda.define('sendTaskNotification', async (job) => {
    const { deviceToken, title } = job.attrs.data;

    try {
        console.log(`Enviando notificación para la tarea: ${title}`);
        await sendNotification(deviceToken, 'Recordatorio de tarea', `Tu tarea "${title}" vence hoy. ¡No olvides completarla!`);
        console.log(`Notificación enviada con éxito para la tarea: ${title}`);
    } catch (error) {
        console.error(`Error al enviar la notificación para la tarea "${title}":`, error);
    }
});

// Iniciar Agenda
(async function () {
    try {
        await agenda.start();
        console.log('Agenda iniciada correctamente');
    } catch (error) {
        console.error('Error al iniciar Agenda:', error);
    }
})();

export default agenda;



// // config/agenda.js
// import Agenda from 'agenda';
// import dotenv from 'dotenv';
// import { sendNotification } from './pushNotificationService.js';
// dotenv.config();

// const agenda = new Agenda({
//     db: {
//         address: process.env.MONGO_URI, 
//         collection: 'agendaJobs', 
//     },
//     processEvery: '1 minute', // Intervalo de verificación
// });

// // Definir el trabajo "sendTaskNotification"
// agenda.define('sendTaskNotification', async (job) => {
//     const { deviceToken, title } = job.attrs.data;

//     console.log(`Enviando notificación para la tarea: ${title}`);
//     // Aquí llamas a tu función de notificaciones push
//     await sendNotification(deviceToken, 'Recordatorio de tarea', `Tu tarea "${title}" vence hoy. ¡No olvides completarla!`);
// });

// // Iniciar Agenda
// (async function () {
//     await agenda.start();
//     console.log('Agenda iniciada');
// })();

// export default agenda;
