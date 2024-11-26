import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';

const Register = ({ navigation }) => {
    // Estados para los campos del formulario
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Función para manejar el registro
    const handleRegister = () => {
        // Aquí agregarías la lógica de registro (por ejemplo, validación y envío a un backend)
        if (!username || !email || !password) {
            Alert.alert('Por favor, completa todos los campos.');
            return;
        }

        // Ejemplo de una alerta de registro exitoso
        Alert.alert('¡Registro exitoso!', `Bienvenido, ${username}!`, [
            {
                text: 'OK',
                onPress: () => navigation.navigate('Home'), // Navegar a la pantalla principal (Home)
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear Cuenta</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Button title="Registrarse" onPress={handleRegister} />

            <View style={styles.footer}>
                <Text>¿Ya tienes una cuenta?</Text>
                <Button
                    title="Iniciar sesión"
                    onPress={() => navigation.navigate('Login')} // Navegar a la pantalla de login
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 5,
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
});

export default Register;
