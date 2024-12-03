import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Ahora no es obligatorio para usuarios de Google
    googleId: { type: String, unique: true, sparse: true } // `sparse` permite índices únicos nulos
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false; // Evita comparar si el usuario no tiene contraseña
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware pre-save para encriptar la contraseña solo si está presente
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        next();
    } else {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
});

const User = mongoose.model('User', userSchema);

export default User;
