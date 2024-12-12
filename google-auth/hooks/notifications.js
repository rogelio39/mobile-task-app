import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';

const URL1 = "http://10.0.2.2:5000"

export const usePushNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [notification, setNotification] = useState(false);


    useEffect(() => {
        // Configurar cómo se manejarán las notificaciones en primer plano
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });

        const registerForPushNotificationsAsync = async () => {
            if (!Device.isDevice) {
                alert('Las notificaciones push no funcionan en emuladores.');
                return;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                alert('No se obtuvo permiso para enviar notificaciones push.');
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoPushToken(token);

            // Enviar el token al backend después de obtenerlo
            if (token) {
                try {
                    const response = await fetch(`${URL1}/api/users/save-expo-push-token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // Si tienes un token de autenticación, puedes agregarlo aquí
                            'Authorization': `Bearer ${yourAuthToken}`,
                        },
                        body: JSON.stringify({
                            expoPushToken: token,
                        }),
                    });
                    const data = await response.json();
                    if (data.success) {
                        console.log('Token enviado con éxito al backend');
                    } else {
                        console.log('Error al enviar el token al backend');
                    }
                } catch (error) {
                    console.error('Error al enviar el token al backend', error);
                }
            }
        };

        // Llamar a la función para obtener el token
        registerForPushNotificationsAsync();

        // Manejar notificaciones entrantes
        const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('Notificación seleccionada:', response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);

    return { expoPushToken, notification };
};
