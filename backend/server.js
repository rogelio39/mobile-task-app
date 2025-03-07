import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';
import UserRouter from './routes/Users.routes.js';
import TaskRouter from './routes/Tasks.routes.js';
import EmailRouter from './routes/nodemail.routes.js';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import agenda from './config/agenda.js';
import bodyParser from 'body-parser';
import { initializeFirebaseAdmin } from './config/pushNotificationService.js';
import { sendNotification } from './config/pushNotificationService.js';





const app = express();

const URL1 = process.env.MODE === "DEV" ? process.env.LOCAL_URL : process.env.FRONTEND_URL;
const whiteList = [URL1];

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) != -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('access denied'));
        }
    },
    credentials: true
};

// Middleware para parsear JSON
app.use(bodyParser.json());

app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

initializeFirebaseAdmin(); // Inicializar Firebase Admin al cargar el servicio

app.use(express.json());

// Configuración de la sesión usando connect-mongo
app.use(session({
    secret: process.env.YOUR_SECRET, // Asegúrate de definir YOUR_SECRET en el archivo .env
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL, // Reutiliza la conexión de MongoDB
        ttl: 24 * 60 * 60 // Tiempo de vida de la sesión en segundos (24 horas en este ejemplo)
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // Configura la duración de la cookie (24 horas en este ejemplo)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Conexión a la base de datos
connectDB();

// Rutas
app.use('/api/users', UserRouter);
app.use('/api/tasks', TaskRouter);
app.use('/api/email', EmailRouter);






// Inicia Agenda y programa un trabajo de prueba
(async () => {
    try {
        await agenda.start();
        console.log('Agenda iniciada correctamente');

    } catch (error) {
        console.error('Error al iniciar Agenda:', error);
    }
})();

agenda.on('start', (job) => {
    console.log(`Job ${job.attrs.name} se ha iniciado`);
});

agenda.on('complete', (job) => {
    console.log(`Job ${job.attrs.name} se ha completado`);
});

agenda.on('fail', (err, job) => {
    console.error(`Job ${job.attrs.name} falló con el error: ${err.message}`);
});

// Define el trabajo
agenda.define('sendTaskNotification', async (job) => {
    const { deviceToken, title } = job.attrs.data;
    console.log(`Enviando notificación: ${title} al dispositivo: ${deviceToken} en server`);
    await sendNotification(deviceToken, title); // Asegúrate de implementar esta función
});






// agenda.define("sendTaskNotification", async (job) => {
//     console.log("Ejecutando job:", job.attrs);

//     const { deviceToken, title } = job.attrs.data; 

//     const mensaje = {
//         notification: {
//             title: title || "Notificación",
//             body: "Este es un mensaje de prueba"
//         },
//         token: deviceToken
//     };

//     try {
//         const response = await admin.messaging().send(mensaje);
//         console.log("Notificación enviada con éxito:", response);
//     } catch (error) {
//         console.error("Error al enviar la notificación:", error);
//     }
// });







const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
