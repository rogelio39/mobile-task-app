// models/ServiceAccount.js
import mongoose from 'mongoose';

const serviceAccountSchema = new mongoose.Schema({
    credentials: {
        type: Object,
        required: true,
    },
});

const ServiceAccount = mongoose.model('ServiceAccount', serviceAccountSchema);
export default ServiceAccount;
