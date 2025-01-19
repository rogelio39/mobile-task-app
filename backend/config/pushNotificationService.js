import admin from 'firebase-admin';
import ServiceAccount from '../models/serviceAccount.models.js'; // Importas el modelo previamente definido
import 'dotenv/config';

// Obtener el documento con las credenciales de Firebase desde MongoDB
const getServiceAccount = async () => {
    try {
        const serviceAccountDoc = await ServiceAccount.findOne();
        if (!serviceAccountDoc) {
            throw new Error('Service Account not found in MongoDB');
        }
        const serviceAccount = serviceAccountDoc.credentials;
        return serviceAccount;
    } catch (error) {
        console.error('Error getting Service Account from MongoDB:', error.message);
        throw error;
    }
};

// Validar las credenciales de la cuenta de servicio
const validateServiceAccount = (serviceAccount) => {
    const requiredFields = ['project_id', 'private_key', 'client_email'];
    for (const field of requiredFields) {
        if (!serviceAccount[field]) {
            throw new Error(`Missing field '${field}' in Service Account credentials`);
        }
    }
};

// Inicializar Firebase Admin SDK
export const initializeFirebaseAdmin = async () => {
    try {
        const serviceAccount = await getServiceAccount();
        validateServiceAccount(serviceAccount); // Validar antes de usar
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin SDK initialized successfully!');
    } catch (error) {
        console.error('Error initializing Firebase Admin SDK:', error.message);
    }
};



// Función para enviar notificaciones
export async function sendNotification(deviceToken, title, body) {
    try {
        const message = {
            token: deviceToken,
            notification: {
                title,
                body,
            },
            android: {
                priority: 'high',
            },
            apns: {
                headers: {
                    'apns-priority': '10',
                },
                payload: {
                    aps: {
                        sound: 'default',
                    },
                },
            },
        };

        const response = await admin.messaging().send(message);


    } catch (error) {
        console.error('Error enviando notificación:', error.message);
        throw new Error(`No se pudo enviar la notificación: ${error.message}`);
    }
}
