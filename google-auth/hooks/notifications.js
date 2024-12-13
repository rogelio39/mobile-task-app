import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';

// const URL1 = "http://10.0.2.2:5000"; // Cambia esta URL si pruebas en un dispositivo físico
const URL1 = "https://mobile-task-app.onrender.com";

export const usePushNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [notification, setNotification] = useState(false);
    const [error, setError] = useState(null); // Nuevo estado para manejar errores

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
            try {
                if (!Device.isDevice) {
                    setError('Debes usar un dispositivo físico para probar las notificaciones push.');
                    alert('Las notificaciones push no funcionan en emuladores.');
                    return;
                }

                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                console.log('Estado de permisos existentes:', existingStatus);

                let finalStatus = existingStatus;

                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    console.log('Estado de permisos después de la solicitud:', status);
                    finalStatus = status;
                }

                if (finalStatus !== 'granted') {
                    setError('Permiso denegado para enviar notificaciones push.');
                    alert('No se obtuvo permiso para enviar notificaciones push.');
                    return;
                }

                const token = (await Notifications.getExpoPushTokenAsync()).data;
                console.log('Token generado:', token);

                if (!token) {
                    setError('No se pudo generar el token de notificaciones.');
                    console.error('Token no obtenido. Verifica tu configuración.');
                    return;
                }

                setExpoPushToken(token);

                // Enviar el token al backend
                try {
                    const response = await fetch(`${URL1}/api/users/save-expo-push-token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ expoPushToken: token }),
                    });

                    const data = await response.json();
                    console.log('Respuesta del backend:', data);

                    if (!data.success) {
                        console.error('Error al enviar el token al backend:', data.message || 'Sin mensaje');
                        setError('Error al enviar el token al backend.');
                    } else {
                        console.log('Token enviado con éxito al backend.');
                    }
                } catch (error) {
                    console.error('Error al enviar el token al backend:', error);
                    setError('Error al comunicarse con el servidor.');
                }
            } catch (err) {
                console.error('Error en el registro de notificaciones:', err);
                setError('Ocurrió un error al configurar las notificaciones.');
            }
        };

        // Llamar a la función para obtener el token
        registerForPushNotificationsAsync();

        // Manejar notificaciones entrantes
        const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
            console.log('Notificación recibida:', notification);
            setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('Notificación seleccionada:', response);
        });

        // Limpieza de listeners al desmontar el componente
        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);

    return { expoPushToken, notification, error }; // Devuelve también el error
};
