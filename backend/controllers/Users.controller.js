import User from '../models/Users.models.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const saveExpoPushToken = async (req, res) => {
    const { expoPushToken } = req.body;

    if (!expoPushToken) {
        return res.status(400).json({ message: 'Token no proporcionado.' });
    }

    try {
        // Buscar al usuario usando su ID desde el JWT en la sesión
        console.log("expopushtoken backend", expoPushToken)
        console.log("req id", req.user._id)
        const user = await User.findById(req.user._id); // Suponiendo que req.user._id está presente

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Guardar el expoPushToken en el usuario
        user.expoPushToken = expoPushToken;
        await user.save();

        res.status(200).json({ message: 'Token guardado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al guardar el token.', error: error.message });
    }
};
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    console.log("userexist", userExists)
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }


    const user = await User.create({ name, email, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("email", email, password)

    const user = await User.findOne({ email });
    if (user) {
        if (user.googleId) {
            return res.status(400).json({ message: 'Please log in with Google' });
        }
        if (await user.matchPassword(password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
