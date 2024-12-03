// routes.js (o el archivo donde tengas tus rutas)
import express from 'express';
import { scheduleEmailReminder } from '../controllers/reminder.controller.js';

const EmailRouter = express.Router();

// Ruta para programar el recordatorio
EmailRouter.post('/schedule-reminder', scheduleEmailReminder);

export default EmailRouter;
