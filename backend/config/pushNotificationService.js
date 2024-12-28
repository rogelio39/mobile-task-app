import admin from 'firebase-admin';
import ServiceAccount from '../models/serviceAccount.models.js';  // Importas el modelo previamente definido
import 'dotenv/config';

const getServiceAccount = async () => {
    try {
        // Obtener el documento que contiene las credenciales de Firebase
        const serviceAccountDoc = await ServiceAccount.findOne();
        if (!serviceAccountDoc) {
            throw new Error('Service Account not found in MongoDB');
        }

        // Usar las credenciales para Firebase Admin
        const serviceAccount = serviceAccountDoc.credentials;
        return serviceAccount;
    } catch (error) {
        console.error('Error getting Service Account from MongoDB:', error.message);
        throw error;
    }
};

const validateServiceAccount = (serviceAccount) => {
    const requiredFields = ['project_id', 'private_key', 'client_email'];
    for (const field of requiredFields) {
        if (!serviceAccount[field]) {
            throw new Error(`Missing field '${field}' in Service Account credentials`);
        }
    }
};

// Función para inicializar Firebase Admin
const initializeFirebaseAdmin = async () => {
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


initializeFirebaseAdmin();  // Llamada a la función de inicialización

// Función para enviar notificaciones
export async function sendNotification(deviceToken, title, body) {
    try {
        const response = await admin.messaging().send({
            token: deviceToken,
            notification: { title, body },
        });
        console.log('Notificación enviada:', response);
    } catch (error) {
        console.error('Error enviando notificación:', error.message);
        throw new Error(`No se pudo enviar la notificación: ${error.message}`);
    }
}

