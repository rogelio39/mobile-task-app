import Task from '../models/Task.models.js';

// Controlador para crear una nueva tarea
export const createTask = async (req, res) => {
    const { title, description, dueDate, priority, notes, createdBy, assignedTo } = req.body;

    try {
        // Validar la fecha de vencimiento (dueDate)
        const dueDateObj = dueDate ? new Date(dueDate) : null;
        const createdDate = new Date();

        // Si dueDate es inválido
        if (isNaN(dueDateObj.getTime())) {
            return res.status(400).json({ message: 'Fecha de vencimiento inválida' });
        }

        // Si dueDate es anterior a la fecha de creación, ajustamos la fecha de vencimiento
        if (dueDateObj <= createdDate) {
            console.log('La fecha de vencimiento está en el pasado, ajustando a un día después');
            dueDateObj.setDate(createdDate.getDate() + 1);  // Ajustamos a 1 día después de la fecha actual
        }

        // Crear la tarea
        const newTask = new Task({
            title,
            description,
            dueDate: dueDateObj, // Usamos la fecha ajustada
            priority: priority || 'Medium', 
            notes,
            createdBy: req.user._id, 
            assignedTo: assignedTo || req.user._id,
            completed: false
        });

        console.log("Nueva tarea:", newTask);

        await newTask.save();

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
