import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { fetchTasksForDate } from '../Services/Api'; // Supongo que tienes esta función
import { useTaskContext } from '../Context/TasksContext'; // Supongo que ya tienes este contexto

const CalendarTask = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // String 'YYYY-MM-DD'
    const [tasksForDate, setTasksForDate] = useState([]);
    const { tasks } = useTaskContext();



    useEffect(() => {
        // Carga las tareas al seleccionar una fecha
        const loadTasks = async () => {
            try {
                const data = await fetchTasksForDate(selectedDate);
                if (Array.isArray(data)) {
                    setTasksForDate(data);
                } else {
                    console.warn('El dato recibido no es un array:', data);
                    setTasksForDate([]);
                }
            } catch (error) {
                console.error('Error al obtener las tareas para la fecha seleccionada:', error);
            }
        };

        loadTasks();
    }, [selectedDate]);

    // Formatear tareas para marcarlas en el calendario
    const markedDates = tasks.reduce((acc, task) => {
        if (task.dueDate) {
            const date = task.dueDate.split('T')[0];
            acc[date] = { marked: true, dotColor: 'blue' };
        } else {
            console.warn('Tarea sin dueDate:', task);
        }
        return acc;
    }, {});



    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={(day) => {
                    console.log('Día seleccionado:', day);
                    setSelectedDate(day.dateString);
                }}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: {
                        selected: true,
                        marked: true,
                        selectedColor: 'orange',
                    },
                }}
            />

            <View style={styles.tasksContainer}>
                <Text style={styles.title}>Tareas para {selectedDate}:</Text>
                {tasksForDate.length > 0 ? (
                    <FlatList
                        data={tasksForDate}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.task}>
                                <Text style={styles.taskTitle}>{item.title}</Text>
                                <Text>{item.description}</Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text>No hay tareas para esta fecha</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    tasksContainer: {
        marginTop: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    task: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    taskTitle: {
        fontWeight: 'bold',
    },
});

export default CalendarTask;
