import mongoose from 'mongoose';
import 'dotenv/config'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected');
        // Accede a la colección `agendaJobs`

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};



export default connectDB;
