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
import { sendNotification } from './config/pushNotificationService.js';
const app = express();

process.env.TZ = 'America/Argentina/Buenos_Aires'; // Ajusta según tu zona horaria

console.log('Fecha y hora actual:', new Date().toLocaleString());


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

app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

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

app.post('/send-notification', async (req, res) => {
    const { deviceToken, title, body } = req.body;
    console.log("devicetoke, title, body", deviceToken, title, body);

    if (!deviceToken || !title || !body) {
        return res.status(400).json({ error: 'Faltan campos necesarios' });
    }

    try {
        const result = await sendNotification(deviceToken, title, body);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error('Error enviando notificación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
