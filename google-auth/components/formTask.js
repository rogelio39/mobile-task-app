import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useTaskContext } from '../Context/TasksContext';
import FormTask from './formTask';
import Toast from 'react-native-toast-message';

const Dashboard = () => {
    const [tasksState, setTasksState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewTaskId, setViewTaskId] = useState(null);
    const { tasks, removeTask, completeTasks } = useTaskContext();

    useEffect(() => {
        setTasksState(tasks);
        if (tasks) {
            setLoading(false);
        }
    }, [tasks]);

    const formatDate = (dateString) => {
        if (!dateString) return 'No tiene fecha para cumplirse';
        return new Date(dateString).toLocaleDateString('es-AR');
    };

    const toggleViewInfo = (taskId) => {
        setViewTaskId((prevId) => (prevId === taskId ? null : taskId));
    };

    const taskComplet = async (taskId) => {
        try {
            await completeTasks(taskId);
            setTasksState((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? { ...task, completed: true } : task
                )
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
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

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
                            style={[styles.taskItem, task.completed && styles.completed]}
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
                            {viewTaskId === task._id && (
                                <View style={styles.taskDetails}>
                                    <Text>Descripción: {task.description}</Text>
                                    <Text>Fecha: {formatDate(task.dueDate)}</Text>
                                    <Text>Prioridad: {task.priority}</Text>
                                    <Text>Notas: {task.notes}</Text>
                                    <Text>Estado: {task.completed ? 'Completada' : 'Pendiente'}</Text>
                                    {!task.completed && (
                                        <TouchableOpacity
                                            onPress={() => taskComplet(task._id)}
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
    errorContainer: {
        padding: 20,
        backgroundColor: '#f8d7da',
        borderRadius: 5,
        marginBottom: 20,
    },
    errorText: {
        color: '#721c24',
        fontWeight: 'bold',
    }
});

export default Dashboard;
