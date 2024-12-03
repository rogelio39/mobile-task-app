import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    dueDate: { type: Date }, // Fecha límite de la tarea
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }, // Nivel de prioridad
    notes: { type: String }, // Notas adicionales
    createdAt: { type: Date, default: Date.now }, // Fecha de creación
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
