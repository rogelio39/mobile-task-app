import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useTaskContext } from '../Context/TasksContext';
import FormTask from './formTask';
import Toast from 'react-native-toast-message';

const URL1 = process.env.REACT_APP_MODE === "DEV" ? process.env.REACT_APP_LOCAL_URL : process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
    const [tasksState, setTasksState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState({});
    const { tasks, removeTask } = useTaskContext();

    useEffect(() => {
        setTasksState(tasks);
        if (tasks) {
            setLoading(false);
        }
    }, [tasks]);

    const formatDate = (dateString) => {
        if (!dateString) return 'No tiene fecha para cumplirse';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const toggleViewInfo = (taskId) => {
        setView((prevView) => ({
            ...prevView,
            [taskId]: !prevView[taskId],
        }));
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

            const updatedTask = await res.json();
            setTasksState((prevTasks) =>
                prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
            );
            Toast.show({ type: 'success', text1: 'Tarea completada' });
        } catch (err) {
            setError(err.message);
            Toast.show({ type: 'error', text1: 'Error al completar la tarea' });
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await removeTask(taskId);
            setTasksState((prevTasks) =>
                prevTasks.filter((task) => task._id !== taskId)
            );
            Toast.show({ type: 'success', text1: 'Tarea eliminada' });
        } catch (err) {
            setError(err.message);
            Toast.show({ type: 'error', text1: 'Error al eliminar la tarea' });
        }
    };

    const groupByDate = (tasks) => {
        return tasks.reduce((acc, task) => {
            const formattedDate = formatDate(task.dueDate);
            if (!acc[formattedDate]) {
                acc[formattedDate] = [];
            }
            acc[formattedDate].push(task);
            return acc;
        }, {});
    };

    const groupedTasks = groupByDate(tasksState);

    if (loading) return <Text>Cargando tareas...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Dashboard de Tareas</Text>
            <FormTask />
            {Object.keys(groupedTasks).map((date) => (
                <View key={date} style={styles.group}>
                    <Text style={styles.date}>{date}</Text>
                    {groupedTasks[date].map((task) => (
                        <TouchableOpacity
                            key={task._id}
                            style={[
                                styles.taskItem,
                                task.completed && styles.completed,
                            ]}
                            onPress={() => toggleViewInfo(task._id)}
                            onLongPress={() =>
                                Alert.alert(
                                    'Eliminar Tarea',
                                    '¿Estás seguro de eliminar esta tarea?',
                                    [
                                        { text: 'Cancelar', style: 'cancel' },
                                        { text: 'Eliminar', onPress: () => deleteTask(task._id) },
                                    ]
                                )
                            }
                        >
                            <Text style={styles.taskTitle}>{task.title}</Text>
                            {view[task._id] && (
                                <View style={styles.taskDetails}>
                                    <Text>Descripción: {task.description}</Text>
                                    <Text>Fecha: {formatDate(task.dueDate)}</Text>
                                    <Text>Prioridad: {task.priority}</Text>
                                    <Text>Notas: {task.notes}</Text>
                                    <Text>Estado: {task.completed ? 'Completada' : 'Pendiente'}</Text>
                                    {!task.completed && (
                                        <TouchableOpacity
                                            onPress={() => completeTask(task._id)}
                                            style={styles.completeButton}
                                        >
                                            <Text style={styles.buttonText}>Completar</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
            <Toast />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    group: { marginBottom: 20 },
    date: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    taskItem: { padding: 15, backgroundColor: '#f5f5f5', marginBottom: 10, borderRadius: 5 },
    completed: { backgroundColor: '#d3ffd3' },
    taskTitle: { fontSize: 16, fontWeight: 'bold' },
    taskDetails: { marginTop: 10 },
    completeButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, marginTop: 10 },
    buttonText: { color: '#fff', textAlign: 'center' },
});

export default Dashboard;
