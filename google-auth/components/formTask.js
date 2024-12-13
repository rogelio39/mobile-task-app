import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTaskContext } from "../Context/TasksContext";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { usePushNotifications } from '../hooks/notifications';

const FormTask = () => {
    const { expoPushToken } = usePushNotifications();
    const { addTask } = useTaskContext();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        notes: '',
        dueDate: ''
    });

    console.log("expopushtoken", expoPushToken)
    const validateForm = () => {
        if (!newTask.title || newTask.title.length < 3) {
            setError('El título debe tener al menos 3 caracteres.');
            return false;
        }
        if (!newTask.description || newTask.description.length < 10) {
            setError('La descripción debe tener al menos 10 caracteres.');
            return false;
        }
        if (!newTask.dueDate) {
            setError('La fecha de vencimiento es obligatoria.');
            return false;
        }
        if (new Date(newTask.dueDate) < new Date()) {
            setError('La fecha de vencimiento no puede ser en el pasado.');
            return false;
        }
        return true;
    };

    const handleTaskSubmit = async () => {
        // if (!expoPushToken) {
        //     setError("El token de notificaciones no está disponible.");
        //     return;
        // }

        if (!validateForm()) return;

        setLoading(true);
        try {
            const taskData = { 
                ...newTask, 
                expoPushToken
            };
            await addTask(taskData);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Añadir Nueva Tarea</Text>
            <TextInput
                style={[styles.input, error && !newTask.title && styles.inputError]}
                value={newTask.title}
                onChangeText={(text) => {
                    setError(null);
                    setNewTask({ ...newTask, title: text });
                }}
                placeholder="Título"
                placeholderTextColor="#888"
            />
            <TextInput
                style={[styles.input, styles.textarea, error && !newTask.description && styles.inputError]}
                value={newTask.description}
                onChangeText={(text) => {
                    setError(null);
                    setNewTask({ ...newTask, description: text });
                }}
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

            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateButtonText}>Seleccionar Fecha de Vencimiento</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={newTask.dueDate ? new Date(newTask.dueDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (event.type !== 'dismissed' && selectedDate) {
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
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <Button title="Agregar Tarea" onPress={handleTaskSubmit} color="#007BFF" />
            )}
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
    inputError: {
        borderColor: 'red'
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
    dateButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#007BFF',
        alignItems: 'center',
        marginBottom: 15
    },
    dateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    selectedDate: {
        marginTop: 10,
        fontSize: 16,
        color: '#555'
    }
});

export default FormTask;
