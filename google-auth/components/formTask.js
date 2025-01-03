import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const URL1 = 'https://tu-backend.com/api';

export default function App() {
    const [deviceToken, setDeviceToken] = useState(null);
    const [notification, setNotification] = useState(null);

    // Configurar cómo se manejarán las notificaciones
    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });
    }, []);

    // Listener para notificaciones en primer plano
    useEffect(() => {
        const foregroundSubscription = Notifications.addNotificationReceivedListener((notification) => {
            try {
                console.log('Notificación recibida:', notification);
                if (notification && notification.request?.content) {
                    setNotification(notification); // Guardar la notificación si es válida
                } else {
                    console.warn('Notificación inválida:', notification);
                }
            } catch (error) {
                console.error('Error al manejar la notificación:', error);
            }
        });

        // Cleanup del listener
        return () => foregroundSubscription.remove();
    }, []);

    // Obtener y enviar el token del dispositivo
    useEffect(() => {
        async function getToken() {
            try {
                if (Device.isDevice) {
                    const { status: existingStatus } = await Notifications.getPermissionsAsync();
                    let finalStatus = existingStatus;

                    if (existingStatus !== 'granted') {
                        const { status } = await Notifications.requestPermissionsAsync();
                        finalStatus = status;
                    }

                    if (finalStatus !== 'granted') {
                        console.warn('Permiso para notificaciones denegado');
                        return;
                    }

                    const tokenData = await Notifications.getExpoPushTokenAsync();
                    const token = tokenData.data;
                    console.log('Device Token:', token);
                    setDeviceToken(token);

                    // Enviar el token al backend
                    const response = await fetch(`${URL1}/send-notification`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            deviceToken: token,
                            title: '¡Hola!',
                            body: 'Esto es una notificación de prueba',
                        }),
                    });

                    if (!response.ok) {
                        console.error('Error al enviar el token al backend:', response.status);
                    }
                } else {
                    console.warn('No es un dispositivo físico');
                }
            } catch (error) {
                console.error('Error al obtener o enviar el token:', error);
            }
        }

        getToken();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Notificaciones Expo</Text>

            {notification && notification.request?.content?.title ? (
                <Text>Notificación: {notification.request.content.title}</Text>
            ) : (
                <Text>No hay notificaciones</Text>
            )}

            <Button
                title="Enviar notificación de prueba"
                onPress={async () => {
                    if (deviceToken) {
                        try {
                            const response = await fetch(`${URL1}/send-notification`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    deviceToken,
                                    title: 'Prueba',
                                    body: 'Esta es una notificación de prueba enviada manualmente',
                                }),
                            });

                            if (response.ok) {
                                console.log('Notificación enviada correctamente');
                            } else {
                                console.error('Error al enviar la notificación:', response.status);
                            }
                        } catch (error) {
                            console.error('Error al enviar la notificación:', error);
                        }
                    } else {
                        console.warn('Token del dispositivo no disponible');
                    }
                }}
            />
        </View>
    );
}
