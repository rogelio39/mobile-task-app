import express from 'express';
import { registerUser, loginUser } from '../controllers/Users.controller.js';
import jwt from 'jsonwebtoken';
import User from '../models/Users.models.js';
import { OAuth2Client } from 'google-auth-library';

const UserRouter = express.Router();
const client = new OAuth2Client([
    process.env.GOOGLE_CLIENT_ID_WEB, // Tu Client ID de web
    process.env.GOOGLE_CLIENT_ID_ANDROID, // Tu Client ID de Android
]);

UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);



// Ruta para verificar y manejar el token de Google enviado desde el frontend
UserRouter.post('/auth/google', async (req, res) => {
    const { token } = req.body;

    try {
        // Verifica el token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [
                process.env.GOOGLE_CLIENT_ID_WEB,
                process.env.GOOGLE_CLIENT_ID_ANDROID,
            ],
        });

        const payload = ticket.getPayload();
        const googleId = payload['sub'];
        const email = payload['email'];

        // Busca o crea el usuario
        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.create({
                googleId,
                email,
                name: payload['name'],
            });
        }

        const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: appToken });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token inválido' });
    }
});


export default UserRouter;