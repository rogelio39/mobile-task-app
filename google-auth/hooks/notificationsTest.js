import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configuración para mostrar notificaciones mientras la app está abierta
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Obtén el token del dispositivo (Firebase)
export async function registerForPushNotificationsAsync() {
    try {
        // if (!Constants.isDevice) {
        //     console.warn('Advertencia: Pruebas en un simulador, no se podrán recibir notificaciones.');
        //     return null;
        // }

        // Solicitar permisos para notificaciones
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Permisos para notificaciones no concedidos.');
            return null;
        }

        // Obtener el token del dispositivo para Firebase
        const tokenData = await Notifications.getDevicePushTokenAsync();
        console.log('Firebase Device Token:', tokenData.data);
        return tokenData.data;

    } catch (error) {
        console.error('Error al registrar notificaciones push:', error);
        return null;
    }
}
