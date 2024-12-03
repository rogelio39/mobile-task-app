import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types"; // Importamos PropTypes
import { fetchTasks, createTask, updateTask, updateTasksTatus, deleteTask, scheduleEmailReminder } from "../Services/Api";


const TasksContext = createContext();

export const useTaskContext = () => useContext(TasksContext)

export const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchTasks();
                const tasksWithRecurrence = handleRecurrence(data); // Manejamos la recurrencia
                setTasks(tasksWithRecurrence);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, []);

    const handleRecurrence = (tasks) => {

        const newTasks = [];

        tasks.forEach((task) => {
            if (task.recurrence === "daily") {
                newTasks.push(createRecurringTask(task, 1, "day"));
            } else if (task.recurrence === "weekly") {
                newTasks.push(createRecurringTask(task, 7, "day"));
            } else if (task.recurrence === "monthly") {
                newTasks.push(createRecurringTask(task, 1, "month"));
            } else if (task.recurrence === "yearly") {
                newTasks.push(createRecurringTask(task, 1, "year"));
            } else {
                newTasks.push(task); // Si no hay recurrencia, dejamos la tarea igual
            }
        });

        return newTasks;
    };

    const createRecurringTask = (task, interval, unit) => {
        const nextDate = new Date(task.date);
        if (unit === "day") {
            nextDate.setDate(nextDate.getDate() + interval);
        } else if (unit === "month") {
            nextDate.setMonth(nextDate.getMonth() + interval);
        } else if (unit === "year") {
            nextDate.setFullYear(nextDate.getFullYear() + interval);
        }

        if (nextDate > new Date()) {
            return {
                ...task,
                id: Date.now(),
                date: nextDate,
            };
        }

        return task;
    };

    const addTask = async (task) => {

        const newTask = await createTask(task);
        setTasks((prevTasks) => [...prevTasks, newTask]);
        return newTask
    };

    const modifyStatusTask = async (updatedTask) => {
        const updated = await updateTasksTatus(updatedTask);
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task._id === updatedTask._id ? updated : task))
        );
    };

    const modifyTask = async (updatedTask) => {
        const updated = await updateTask(updatedTask);
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task._id === updatedTask._id ? updated : task))
        );
        return 'ok'
    };

    

    

    const sendEmail = async(email, task) => {
        await scheduleEmailReminder(email, task)
    }


    const removeTask = async (id) => {
        const data = await deleteTask(id);
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        return data
    };

    return (
        <TasksContext.Provider
            value={{
                tasks,
                addTask,
                modifyTask,
                modifyStatusTask,
                removeTask,
                updateTask,
                sendEmail,
                loading,
                error,
            }}
        >
            {children}
        </TasksContext.Provider>
    );
};

// Definimos el tipo de prop esperado para `children`
TasksProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

