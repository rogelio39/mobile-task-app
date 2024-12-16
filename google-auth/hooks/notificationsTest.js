// NotificationsManager.js
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configuración para mostrar notificaciones mientras la app está abierta
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

// Obtén el token del dispositivo
export async function registerForPushNotificationsAsync() {
    // if (!Constants.isDevice) {
    //     console.log('Solo dispositivos físicos pueden recibir notificaciones push.');
    //     return null;
    // }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
y
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('No se concedieron permisos para notificaciones.');
        return null;
    }

    const tokenData = await Notifications.getDevicePushTokenAsync();
    console.log("tokendata en notificationtest", tokenData)
    return tokenData.data;
}
