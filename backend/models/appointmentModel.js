import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, default: null }, 
    counId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true }, 
    userData: { type: Object, default: null },
    counData: { type: Object, required: true },
    amount: { type: Number, default: 0 },
    date: { type: Number, required: true }, 
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    paymentId: { type: String, default: null },
    isAvailable: { type: Boolean, default: true }
});

const appointmentModel = mongoose.models.appointment || mongoose.model('Appointment', appointmentSchema);

export default appointmentModel;
