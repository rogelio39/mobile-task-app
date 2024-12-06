import React, { useState } from 'react';
import { View, Text, TextInput, Picker, Button, StyleSheet, Alert } from 'react-native';
import { useTaskContext } from "../Context/TasksContext";

const FormTask = () => {
    const { addTask } = useTaskContext();
    const [tasksState, setTasksState] = useState([]);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        notes: '',
        dueDate: ''
    });

    const handleTaskSubmit = async () => {
        try {
            const createATask = await addTask(newTask);
            setTasksState([...tasksState, createATask]);
            setNewTask({
                title: '',
                description: '',
                priority: 'Medium',
                notes: '',
                dueDate: ''
            });
            Alert.alert('Éxito', 'Tarea añadida correctamente');
        } catch (error) {
            console.error('Error al agregar la tarea:', error);
            setError(error.message);
            Alert.alert('Error', 'Error al agregar la tarea');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Añadir Nueva Tarea</Text>
            <TextInput
                style={styles.input}
                value={newTask.title}
                onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                placeholder="Título"
                placeholderTextColor="#888"
                required
            />
            <TextInput
                style={[styles.input, styles.textarea]}
                value={newTask.description}
                onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                placeholder="Descripción"
                placeholderTextColor="#888"
                multiline
                numberOfLines={4}
                required
            />
            <Picker
                selectedValue={newTask.priority}
                style={styles.picker}
                onValueChange={(itemValue) =>
                    setNewTask({ ...newTask, priority: itemValue })
                }
            >
                <Picker.Item label="Alta" value="High" />
                <Picker.Item label="Media" value="Medium" />
                <Picker.Item label="Baja" value="Low" />
            </Picker>
            <TextInput
                style={styles.input}
                value={newTask.dueDate}
                onChangeText={(text) => setNewTask({ ...newTask, dueDate: text })}
                placeholder="Fecha de vencimiento (YYYY-MM-DD)"
                placeholderTextColor="#888"
            />
            <TextInput
                style={[styles.input, styles.textarea]}
                value={newTask.notes}
                onChangeText={(text) => setNewTask({ ...newTask, notes: text })}
                placeholder="Notas"
                placeholderTextColor="#888"
                multiline
                numberOfLines={4}
            />
            <Button title="Agregar Tarea" onPress={handleTaskSubmit} color="#007BFF" />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16
    },
    textarea: {
        height: 80,
        textAlignVertical: 'top'
    },
    picker: {
        height: 50,
        marginBottom: 15
    },
    error: {
        color: 'red',
        marginTop: 10
    }
});

export default FormTask;
