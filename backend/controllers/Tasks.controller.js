import Task from '../models/Task.models.js';
// import { schedulePushNotification } from '../config/pushNotificationService.js';

// Controlador para crear una nueva tarea


// Función para ajustar la fecha a las 7 AM del mismo día
const setNotificationTime = (sendDate) => {
    const notificationDate = new Date(sendDate);
    
    // Configurar la fecha para que sea el mismo día a las 7 AM
    notificationDate.setHours(7, 0, 0, 0); // 7 AM, 0 minutos, 0 segundos, 0 milisegundos
    
    return notificationDate;
};

// Función para crear una tarea
export const createTask = async (req, res) => {
    const { title, description, dueDate, priority, notes, createdBy, assignedTo, expoPushToken } = req.body;
    console.log("expopush", expoPushToken)
    try {
        // Validar la fecha de vencimiento (dueDate)
        const dueDateObj = dueDate ? new Date(dueDate) : null;

        if (!dueDate || isNaN(dueDateObj.getTime())) {
            return res.status(400).json({ message: 'Fecha de vencimiento inválida' });
        }

        // Crear la tarea
        const newTask = new Task({
            title,
            description,
            dueDate: dueDateObj,
            priority: priority || 'Medium',
            notes,
            createdBy: req.user._id,
            assignedTo: assignedTo || req.user._id,
            completed: false,
        });

        await newTask.save();

        console.log('Nueva tarea creada:', newTask);

        // Configurar la hora de la notificación para las 7 AM del día de la fecha de vencimiento
        const notificationTime = setNotificationTime(dueDateObj);

        // Programar notificación push si se proporciona el token
        if (expoPushToken) {
            const notificationTitle = 'Recordatorio de tarea';
            const notificationBody = `Tu tarea "${title}" vence hoy. ¡No olvides completarla!`;

            schedulePushNotification(expoPushToken, notificationTitle, notificationBody, notificationTime);
        }

        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
    }
};



export const updateTask = async (req, res) => {

    const { title, description, dueDate, priority, notes } = req.body;


    try {
        // Busca la tarea por su ID
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Actualiza los campos deseados
        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = new Date(dueDate);
        if (priority) task.priority = priority;
        if (notes) task.notes = notes;

        // Guarda los cambios en la base de datos
        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
    }
};




export const getTasks = async (req, res) => {
    const tasks = await Task.find({ $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }] })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
    res.json(tasks);
};

export const updateTaskStatus = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        task.completed = req.body.completed;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};


export const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (deletedTask) {
            res.json(deletedTask);
        }
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};



export const getTaskStats = async (req, res) => {
    const { start, end } = req.query;


    try {



        const taskCount = await Task.countDocuments({
            createdAt: { $gte: new Date(start), $lte: new Date(end) }
        });


        console.log("taskcount", taskCount)

        res.status(200).json({ taskCount });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las estadísticas' });
    }
};


// Controlador para obtener las tareas por fecha
export const getTasksByDate = async (req, res) => {
    const { date } = req.query;
    try {
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);  // Comienza a medianoche
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCHours(23, 59, 59, 999);  // Termina justo antes de la medianoche del siguiente día

        const tasks = await Task.find({
            dueDate: { $gte: startOfDay, $lte: endOfDay }
        });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas para la fecha seleccionada' });
    }
};
