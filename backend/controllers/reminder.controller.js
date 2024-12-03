import schedule from 'node-schedule';
import { resend } from '../config/resend.js';
import { DateTime } from 'luxon';

const scheduledJobs = {};

export const scheduleEmailReminder = async (req, res) => {
    const { email, task } = req.body;
    const jobKey = `${email}-${task.dueDate}`; // Clave única para identificar el trabajo

    try {
        // Convertir `dueDate` a DateTime en UTC
        const dueDate = DateTime.fromISO(task.dueDate, { zone: 'UTC' });
        console.log('Fecha de vencimiento recibida (dueDate en UTC):', dueDate.toISO());

        // Mantener la misma fecha, pero ajustar la hora para las 00:30 en UTC
        const reminderDate = dueDate.set({ hour: 0, minute: 30, second: 0, millisecond: 0 });
        console.log('Fecha programada para el recordatorio (reminderDate):', reminderDate.toISO());

        // Calcular el tiempo hasta el recordatorio
        const timeUntilReminder = reminderDate.diffNow().toMillis();

        // Verificar que el recordatorio está en el futuro
        if (timeUntilReminder <= 0) {
            console.log('El recordatorio debe ser para una fecha futura');
            return res.status(400).json({ error: 'El recordatorio debe ser para una fecha futura' });
        }

        // Cancelar cualquier trabajo programado previo para esta tarea y usuario
        if (scheduledJobs[jobKey]) {
            console.log(`Cancelando trabajo previo para ${jobKey}`);
            scheduledJobs[jobKey].cancel();
        }

        // Programar el trabajo para el recordatorio
        scheduledJobs[jobKey] = schedule.scheduleJob(reminderDate.toJSDate(), async () => {
            console.log("Ejecutando el envío de correo programado en:", DateTime.now().toISO());

            try {
                console.log('Intentando enviar el correo...');
                const { data, error } = await resend.emails.send({
                    from: 'Acme <bandadelriosali@revista-urbana.com>',
                    to: [email],
                    subject: `Tarea: ${task.title} - Prioridad: ${task.priority}`,
                    html: `<strong>${task.title}</strong>
                        <p>${task.description}</p>
                        <p>${task.notes}</p>`,
                });

                if (error) {
                    console.error("Error al enviar el correo:", error);
                } else {
                    console.log("Correo enviado con éxito:", data);
                }
            } catch (error) {
                console.error('Error inesperado al enviar el correo:', error);
            }

            // Eliminar el trabajo una vez que se complete
            delete scheduledJobs[jobKey];
        });

        console.log("Trabajo programado con éxito para:", reminderDate.toISO());
        res.status(200).json({ message: 'Recordatorio programado con éxito' });
    } catch (error) {
        console.error('Error al programar el recordatorio:', error);
        res.status(500).json({ error: 'Error al programar el recordatorio' });
    }
};
