// import { BACKEND_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';


const URL1 = "http://10.0.2.2:5000"




// Obtener todas las tareas
const fetchTasks = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${URL1}/api/tasks`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Error fetching tasks");
    }

    const data = await res.json();
    return data;
};

// Función para programar el recordatorio
const scheduleEmailReminder = async (email, task) => {
    await fetch(`${URL1}/api/email/schedule-reminder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, task })
    });
};
const fetchTasksForDate = async (date) => {
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(`${URL1}/api/tasks/tasks-by-date?date=${date}`, { // Pasa date directamente
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las tareas para la fecha seleccionada:', error);
    }
};




// Crear nueva tarea
const createTask = async (task) => {

    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${URL1}/api/tasks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    if (!res.ok) {
        throw new Error("Error creating task");
    }

    const data = await res.json();
    return data;
};

// Actualizar una tarea existente
const updateTask = async (updatedTask) => {

    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${URL1}/api/tasks/${updatedTask._id}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
    });

    if (!res.ok) {
        throw new Error("Error updating task");
    }

    await res.json();
    return 'ok';
};

const updateTasksTatus = async (updatedTask) => {
    const token = await AsyncStorage.getItem('token');

    const res = await fetch(`${URL1}/api/tasks/${updatedTask._id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
    });

    if (!res.ok) {
        throw new Error("Error updating task");
    }

    const data = await res.json();
    return data;
};

// Eliminar una tarea
const deleteTask = async (id) => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${URL1}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Error deleting task");
    }

    const data = await res.json();
    return data;
};


const completeTask = async (taskId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${URL1}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: true }),
        });

        if (!res.ok) throw new Error('Error marking task as completed');

        await res.json();
    } catch (err) {
        console.log(err.message);
        return null
    }
};





//AUTH API


const Login = async (token) => {
    if (!token) {
        console.error('Error: El token es nulo o indefinido');
        return null;
    }

    try {
        const response = await fetch(`${URL1}/api/users/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token }),
        });

        const data = await response.json();

        if (response.ok) {
            try {
                await AsyncStorage.setItem('token', data.token); // Almacenar el JWT del backend
                return data.token;
            } catch (error) {
                console.error('Error al guardar el token en AsyncStorage:', error);
                throw new Error('Error al guardar el token localmente.');
            }
        } else {
            console.log('Error en el inicio de sesión:', data.message || 'Error desconocido');
            return null;
        }
    } catch (error) {
        console.error('Error en la autenticación:', error);
        return null;
    }
};


export { Login, createTask, completeTask, deleteTask, updateTasksTatus, updateTask, fetchTasksForDate, scheduleEmailReminder, fetchTasks }