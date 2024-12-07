import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useTaskContext } from "../Context/TasksContext";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const FormTask = () => {
    const { addTask } = useTaskContext();
    const [tasksState, setTasksState] = useState([]);
    const [error, setError] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        notes: '',
        dueDate: ''
    });

    const validateForm = () => {
        if (!newTask.title || !newTask.description || !newTask.dueDate) {
            setError('Todos los campos son obligatorios.');
            return false;
        }
        return true;
    };

    const handleTaskSubmit = async () => {
        if (!validateForm()) return;

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
            setError(null);
            Alert.alert('Éxito', 'Tarea añadida correctamente');
        } catch (error) {
            console.error('Error al agregar la tarea:', error);
            setError('Error al agregar la tarea');
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
            />
            <TextInput
                style={[styles.input, styles.textarea]}
                value={newTask.description}
                onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                placeholder="Descripción"
                placeholderTextColor="#888"
                multiline
                numberOfLines={4}
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

            {/* Selector de fecha con DateTimePicker */}
            <Button
                title="Seleccionar Fecha de Vencimiento"
                onPress={() => setShowDatePicker(true)}
                color="#007BFF"
            />
            {showDatePicker && (
                <DateTimePicker
                    value={newTask.dueDate ? new Date(newTask.dueDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                            setNewTask({ ...newTask, dueDate: selectedDate.toISOString() });
                        }
                    }}
                />
            )}
            {newTask.dueDate && (
                <Text style={styles.selectedDate}>
                    Fecha seleccionada: {new Date(newTask.dueDate).toLocaleDateString()}
                </Text>
            )}

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
    },
    selectedDate: {
        marginTop: 10,
        fontSize: 16,
        color: '#555'
    }
});

export default FormTask;
