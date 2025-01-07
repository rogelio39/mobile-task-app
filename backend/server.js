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
import { Expo } from 'expo-server-sdk';
import { initializeFirebaseAdmin } from './config/pushNotificationService.js';



// Crear una nueva instancia de Expo Server SDK
const expo = new Expo();



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


// Inicia la Agenda
// Inicia la Agenda
(async () => {
    try {
        await agenda.start(); // Inicia Agenda
        console.log('Agenda iniciada correctamente');

        // Programar un trabajo de prueba
        await agenda.schedule('in 1 minute', 'sendTaskNotification', {
            deviceToken: 'cputyx-kQ7ijHoZ2itwmB-:APA91bEz7wIL3XlpBZG3ywFbyP0WyKl5qagtttHzWy0a_NX2XuYYDdGohvGi7wVieHslSl1VuLYU0UYvOOLn1qAJxOwcq_50jYM7aMKoQgMbCBWZ3haI00c',
            title: 'Notificación programada automáticamente',
        });

        console.log('Trabajo programado para ejecutarse en 1 minuto');
    } catch (error) {
        console.error('Error al iniciar Agenda:', error);
    }
})();


app.post('/send-notification', async (req, res) => {
    const { deviceToken, title, body } = req.body;
    console.log("datos en send notification", deviceToken, title, body)

    // Validar los datos de entrada
    if (!deviceToken || !title || !body) {
        return res.status(400).json({ error: 'Faltan parámetros necesarios' });
    }

    // Crear un mensaje push
    const messages = [];
    if (Expo.isExpoPushToken(deviceToken)) {
        messages.push({
            to: deviceToken,
            sound: 'default',
            title,
            body,
            data: { withSome: 'data' },
        });
    } else {
        return res.status(400).json({ error: 'Token del dispositivo no válido' });
    }

    try {
        // Enviar las notificaciones
        const ticketChunks = await expo.chunkPushNotifications(messages);
        const tickets = [];
        for (const chunk of ticketChunks) {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }

        console.log('Notificaciones enviadas:', tickets);
        res.status(200).json({ message: 'Notificación enviada correctamente', tickets });
    } catch (error) {
        console.error('Error al enviar notificación:', error);
        res.status(500).json({ error: 'Error al enviar la notificación' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
