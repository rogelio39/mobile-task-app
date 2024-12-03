import express from 'express';
import { createTask, deleteTask, getTasks, updateTaskStatus, getTaskStats, getTasksByDate, updateTask } from '../controllers/Tasks.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const TaskRouter = express.Router();

TaskRouter.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);
TaskRouter.get('/stats',protect, getTaskStats);
TaskRouter.get('/tasks-by-date', protect, getTasksByDate); 
TaskRouter.route('/:id')
    .patch(protect, updateTask)
    .put(protect, updateTaskStatus)
    .delete(protect, deleteTask);
export default TaskRouter;
